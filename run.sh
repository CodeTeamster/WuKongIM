#!/bin/bash
show_help() {
    echo "Usage: ./run.sh [service_name]"
    echo ""
    echo "Supported services:"
    echo "  backend    - Start WuKongIM backend service"
    echo "  web        - Start the admin web interface (React/Vite)"
    echo "  chatdemo   - Start the chat frontend demo (Vue/Vite)"
    echo "  all        - Start all services concurrently in the background (Press Ctrl+C to stop)"
    echo ""
    echo "Example: ./run.sh backend"
}

start_backend() {
    # node-cluster: 7000
    # biz-http: 5001
    # manager-http: 5301
    # chat-tcp: 5100
    # chat-ws: 5200
    echo ">>> Starting WuKongIM backend..."
    go mod tidy
    go run ./cmd/wukongim/ --config wukongim.conf
}

start_web() {
    echo ">>> Starting Admin Web Interface..."
    cd web || exit
    bun install
    VITE_DEV_PORT=5174 VITE_API_BASE_URL=127.0.0.1:5301 bun run dev
}

start_chatdemo() {
    echo ">>> Starting Chat Demo..."
    cd demo/chatdemo || exit
    yarn install
    VITE_DEV_PORT=5175 VITE_API_BASE_URL=127.0.0.1:5001 yarn dev
}

# Check if an argument is provided
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

case "$1" in
    "backend")
        start_backend
        ;;
    "web")
        start_web
        ;;
    "chatdemo")
        start_chatdemo
        ;;
    "all")
        # Start services concurrently
        start_backend &
        BACKEND_PID=$!

        start_web &
        WEB_PID=$!

        start_chatdemo &
        CHATDEMO_PID=$!

        # Catch Ctrl+C to clean up all child processes
        trap "echo '>>> Stopping all services...'; kill $BACKEND_PID $WEB_PID $CHATDEMO_PID; exit" SIGINT SIGTERM

        wait $BACKEND_PID $WEB_PID $CHATDEMO_PID
        ;;
    *)
        echo "Error: Unknown service '$1'"
        show_help
        exit 1
        ;;
esac