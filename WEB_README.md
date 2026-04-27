# 🌐 QuickSearch Web版本

QuickSearch的独立Web应用版本，可以在浏览器中直接使用所有功能，无需安装浏览器插件。

## 🚀 快速启动

### 方式1: 使用npm脚本（推荐）

```bash
npm run dev:web
```

这将自动启动开发服务器并在浏览器中打开Web应用。

### 方式2: 使用启动脚本

**Windows:**
```bash
start-web.bat
```

**Linux/Mac:**
```bash
chmod +x start-web.sh
./start-web.sh
```

### 方式3: 手动启动

```bash
npm run dev
```

然后在浏览器中访问: `http://localhost:5173/src/entries/web.html`

## ✨ 功能特性

### 🎯 核心功能

1. **AI聊天** 💬
   - 与AI助手进行智能对话
   - 支持多轮对话
   - 系统提示词自定义
   - 多模型选择

2. **知识库管理** 📚
   - 创建和组织知识内容
   - 分类管理
   - 快速搜索
   - 导入导出

3. **智能搜索** 🔍
   - 快速搜索功能
   - 历史记录
   - 搜索建议

4. **历史记录** 🕐
   - 查看聊天历史
   - 历史搜索
   - 数据导出

5. **设置中心** ⚙️
   - API配置
   - 主题设置
   - 个性化选项

## 📦 项目结构

```
quicksearch-browser-extension/
├── src/
│   ├── entries/
│   │   ├── web.html          # Web版入口HTML
│   │   └── web.js            # Web版入口JS
│   ├── pages/                # 页面组件
│   │   ├── ChatPage.vue
│   │   ├── KnowledgePage.vue
│   │   ├── HistoryPage.vue
│   │   ├── SearchPage.vue
│   │   ├── SettingsPage.vue
│   │   └── AboutPage.vue
│   └── components/           # 共享组件
├── start-web.bat             # Windows启动脚本
├── start-web.sh              # Linux/Mac启动脚本
└── WEB_README.md             # 本文档
```

## 🎨 界面特点

### 响应式设计
- ✅ 桌面端优化
- ✅ 平板适配
- ✅ 移动端支持

### 现代化UI
- 🎨 清新的配色方案
- 🌈 流畅的动画效果
- 💫 优雅的交互体验

### 导航系统
- 📍 顶部导航栏
- 🔄 路由切换
- 📱 移动端菜单

## 🛠️ 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vue Router** - 官方路由管理器
- **Pinia** - 状态管理
- **Vite** - 下一代前端构建工具
- **Bootstrap Icons** - 图标库

## 📖 使用指南

### 1. 首次使用

1. **启动应用**
   ```bash
   npm run dev:web
   ```

2. **浏览器自动打开**
   - 应用会自动在默认浏览器中打开
   - 显示欢迎页面

3. **选择功能**
   - 点击功能卡片进入对应页面
   - 或使用顶部导航栏切换

### 2. AI聊天

1. 点击"聊天"进入聊天页面
2. 在输入框中输入问题
3. 可选择系统提示词和AI模型
4. 按Ctrl+Enter或点击发送按钮

### 3. 知识库管理

1. 点击"知识库"进入知识库页面
2. 创建新的知识条目
3. 组织和分类内容
4. 使用搜索功能快速查找

### 4. 查看历史

1. 点击"历史"查看聊天记录
2. 可以搜索和过滤历史
3. 支持导出历史数据

### 5. 个性化设置

1. 点击"设置"进入设置页面
2. 配置API密钥
3. 调整主题和偏好
4. 管理数据

## 🔧 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev:web

# 运行测试
npm run test

# 代码检查
npm run lint

# 代码格式化
npm run format
```

### 构建生产版本

```bash
# 构建Web版本
npm run build:web

# 预览构建结果
npm run preview:web
```

### 项目配置

Web版本的配置在 `vite.config.js` 中：

```javascript
{
  input: {
    web: resolve(__dirname, 'src/entries/web.html')
  }
}
```

## 🌍 浏览器兼容性

| 浏览器 | 版本 | 支持状态 |
|--------|------|----------|
| Chrome | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |

## 📱 移动端支持

Web版本完全支持移动设备：

- ✅ 响应式布局
- ✅ 触摸优化
- ✅ 移动端菜单
- ✅ 手势支持

## 🔐 数据安全

- 所有数据存储在浏览器本地
- 不会上传到服务器
- 支持数据导出和备份
- 可以随时清除数据

## 🆚 Web版 vs 插件版

| 特性 | Web版 | 插件版 |
|------|-------|--------|
| 安装 | 无需安装 | 需要安装 |
| 使用 | 浏览器访问 | 浏览器集成 |
| 功能 | 完整功能 | 完整功能 + 页面集成 |
| 更新 | 自动更新 | 手动更新 |
| 数据 | 本地存储 | 本地存储 |

## 💡 使用技巧

### 1. 快捷键

- `Ctrl + Enter` - 发送消息
- `Ctrl + K` - 快速搜索
- `Ctrl + ,` - 打开设置

### 2. 提高效率

- 使用系统提示词快速设置对话场景
- 收藏常用的知识条目
- 利用历史记录快速回顾

### 3. 自定义

- 调整主题颜色
- 设置默认模型
- 配置快捷操作

## 🐛 故障排除

### 问题1: 页面无法加载

**解决方案:**
1. 检查网络连接
2. 清除浏览器缓存
3. 重启开发服务器

### 问题2: API调用失败

**解决方案:**
1. 检查API密钥配置
2. 确认API服务可用
3. 查看浏览器控制台错误

### 问题3: 数据丢失

**解决方案:**
1. 检查浏览器存储设置
2. 不要清除浏览器数据
3. 定期导出备份

## 📊 性能优化

- ⚡ 代码分割
- 🗜️ 资源压缩
- 📦 懒加载
- 🚀 预加载关键资源

## 🔄 更新日志

### v1.0.0 (2025-10-22)
- ✨ 初始Web版本发布
- ✅ 完整功能实现
- ✅ 响应式设计
- ✅ 移动端支持

## 🤝 贡献

欢迎提交问题和改进建议！

### 贡献步骤

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📞 支持

- 📧 Email: support@quicksearch.com
- 💬 Discord: [加入社区](https://discord.gg/quicksearch)
- 🐛 Issues: [GitHub Issues](https://github.com/quicksearch/issues)

## 📄 许可证

MIT License

---

**享受使用QuickSearch Web版本！** 🎉

如有任何问题或建议，欢迎随时联系我们。
