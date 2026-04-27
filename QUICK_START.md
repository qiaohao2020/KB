# 🚀 QuickSearch 快速启动指南

## 📋 前提条件

确保已安装Node.js和npm：
```bash
node --version  # 应该显示 v14.0.0 或更高版本
npm --version   # 应该显示 6.0.0 或更高版本
```

## 🎯 快速启动

### 1️⃣ 安装依赖（首次运行）

```bash
npm install
```

### 2️⃣ 选择运行模式

#### 🌐 Web版本（推荐用于开发和测试）

```bash
npm run dev:web
```

或使用启动脚本：
- Windows: `start-web.bat`
- Linux/Mac: `./start-web.sh`

浏览器会自动打开: `http://localhost:5173/src/entries/web.html`

#### 🧪 组件测试页面

```bash
npm run test:ui
```

或使用启动脚本：
- Windows: `start-test.bat`
- Linux/Mac: `./start-test.sh`

浏览器会自动打开: `http://localhost:5173/test-page.html`

#### 🔌 浏览器插件开发

```bash
npm run dev
```

然后在浏览器中加载 `dist` 目录作为未打包的扩展程序。

## 📚 详细文档

- **Web版本**: 查看 [WEB_README.md](./WEB_README.md)
- **测试页面**: 查看 [TEST_README.md](./TEST_README.md)
- **完整指南**: 查看 [TEST_GUIDE.md](./TEST_GUIDE.md)

## 🛠️ 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动插件开发服务器 |
| `npm run dev:web` | 启动Web版本 |
| `npm run test:ui` | 启动组件测试页面 |
| `npm run build` | 构建浏览器插件 |
| `npm run build:web` | 构建Web版本 |
| `npm run test` | 运行单元测试 |
| `npm run lint` | 代码检查 |
| `npm run format` | 代码格式化 |

## 🎨 功能概览

### Web版本功能
- ✅ AI聊天对话
- ✅ 知识库管理
- ✅ 智能搜索
- ✅ 历史记录
- ✅ 个性化设置

### 测试页面功能
- ✅ MessageInput组件测试
- ✅ SystemPromptSelector组件测试
- ✅ ModelSelector组件测试
- ✅ 完整布局测试

## 🐛 常见问题

### Q: 端口被占用怎么办？
A: Vite会自动使用下一个可用端口，查看终端输出的实际端口号。

### Q: 页面显示空白？
A: 
1. 检查浏览器控制台是否有错误
2. 确保已运行 `npm install`
3. 尝试清除浏览器缓存

### Q: 组件加载失败？
A: 
1. 确保所有依赖已安装
2. 检查文件路径是否正确
3. 查看终端错误信息

## 💡 开发提示

1. **热重载**: 修改代码后会自动刷新浏览器
2. **开发工具**: 按F12打开浏览器开发者工具
3. **Vue DevTools**: 安装Vue DevTools浏览器插件以获得更好的调试体验

## 📞 获取帮助

如果遇到问题：
1. 查看相关README文档
2. 检查浏览器控制台错误
3. 查看终端错误信息
4. 提交Issue到GitHub

---

**祝你开发愉快！** 🎉
