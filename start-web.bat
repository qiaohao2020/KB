@echo off
echo ========================================
echo QuickSearch Web版本启动脚本
echo ========================================
echo.

echo 正在启动Web应用...
echo.
echo 启动后将自动在浏览器中打开:
echo http://localhost:5173/src/entries/web.html
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

npm run dev:web
