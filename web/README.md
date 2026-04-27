# QuickSearch Web Application

基于 Vue 3 + Vite 构建的 AI 智能助手 Web 应用。

## 功能特性

- 🤖 AI 智能聊天对话
- 📚 知识库管理
- 🔍 智能搜索
- 📝 历史记录
- ⚙️ 个性化设置
- 📱 响应式设计，支持移动端

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Vite - 下一代前端构建工具
- Vue Router - 官方路由管理器
- Pinia - Vue 状态管理库
- Bootstrap Icons - 图标库

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
web/
├── src/
│   ├── assets/          # 静态资源
│   │   ├── css/        # 样式文件
│   │   ├── images/     # 图片资源
│   │   └── js/         # JavaScript 工具
│   ├── components/      # Vue 组件
│   ├── views/          # 页面视图
│   ├── router/         # 路由配置
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── index.html          # HTML 模板
├── vite.config.js      # Vite 配置
└── package.json        # 项目配置
```

## 开发说明

### 组件说明

- `ChatContainer.vue` - 聊天容器组件
- `Message.vue` - 消息组件
- `MessageInput.vue` - 消息输入组件
- `PromptDialog.vue` - Prompt 对话框
- `SystemPromptSelector.vue` - 系统提示词选择器
- `ModelSelector.vue` - 模型选择器

### 页面说明

- `/chat` - AI 聊天页面
- `/knowledge` - 知识库管理
- `/search` - 搜索页面
- `/history` - 历史记录
- `/settings` - 设置页面
- `/about` - 关于页面

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## License

MIT
