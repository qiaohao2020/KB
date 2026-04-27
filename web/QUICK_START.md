# QuickSearch Web 快速开始

## 项目说明

这是一个独立的 Vue 3 Web 应用，从 `extension-sidebar/src` 重构而来，专门用于 Web 环境运行。

## 目录结构

```
web/
├── src/
│   ├── assets/          # 静态资源（从 ../src/assets 复制）
│   ├── components/      # Vue 组件（从 ../src/components 复制）
│   ├── views/          # 页面视图（从 ../src/pages 复制）
│   ├── router/         # 路由配置
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── index.html          # HTML 模板
├── vite.config.js      # Vite 配置
├── package.json        # 项目配置
└── README.md           # 项目文档
```

## 快速启动

### 方式一：使用脚本（推荐）

Windows:
```bash
start.bat
```

Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

### 方式二：使用 npm 命令

1. 安装依赖（首次运行）
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 在浏览器中访问
```
http://localhost:3000
```

## 可用命令

- `npm run dev` - 启动开发服务器（端口 3000）
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建

## 与原项目的区别

1. **独立运行**：不依赖浏览器扩展环境
2. **简化配置**：移除了扩展相关的配置
3. **Web 优化**：使用 `createWebHistory` 而不是 `createWebHashHistory`
4. **纯净环境**：没有 Chrome API 调用

## 主要功能

- ✅ AI 聊天对话
- ✅ 知识库管理
- ✅ 智能搜索
- ✅ 历史记录
- ✅ 个性化设置
- ✅ 响应式设计

## 开发提示

1. 所有组件和页面都从 `../src` 复制而来
2. 如需更新，可以重新从 `../src` 复制对应文件
3. 样式文件位于 `src/assets/css/`
4. 图片资源位于 `src/assets/images/`

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 故障排除

### 端口被占用
如果 3000 端口被占用，可以修改 `vite.config.js` 中的端口号：
```js
server: {
  port: 3001, // 改为其他端口
  open: true
}
```

### 依赖安装失败
尝试清除缓存后重新安装：
```bash
rm -rf node_modules package-lock.json
npm install
```

### 热更新不工作
重启开发服务器：
```bash
# Ctrl+C 停止服务器
npm run dev
```

## 技术支持

如有问题，请查看：
- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [Vue Router 文档](https://router.vuejs.org/)
