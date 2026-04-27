# QuickSearch - 智能浏览器扩展助手

QuickSearch 是一个现代化的 Vue.js 浏览器扩展，提供智能聊天、知识库管理、内容检索和历史记录功能。基于 Manifest V3 标准开发，支持多种 AI 服务提供商。

## ✨ 主要功能

- 🤖 **智能问答**: 支持 OpenAI、Claude、Azure OpenAI 等多种 AI 服务
- 📚 **知识库管理**: 个人知识库构建与管理，支持分类和标签
- 🔍 **内容检索**: 快速搜索和检索已保存的内容和对话
- 📝 **历史记录**: 完整的使用历史记录和数据管理
- ⚙️ **灵活配置**: 丰富的设置选项，支持主题切换和个性化配置

## 🛠️ 技术栈

- **框架**: Vue.js 3.4.0
- **构建工具**: Vite 5.0.0
- **状态管理**: Pinia 2.1.0
- **路由**: Vue Router 4.2.0
- **样式**: Bootstrap Icons
- **扩展标准**: Manifest V3

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone [项目地址]
cd extension-sidebar
```

2. **安装依赖**
```bash
npm install
```

3. **开发模式**
```bash
npm run dev
```

4. **构建扩展**
```bash
npm run build
```

5. **加载扩展**
   - 打开 Chrome 浏览器
   - 进入 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目的 `dist` 目录

详细的安装和配置指南请参考 [扩展加载指南](./docs/guides/EXTENSION_LOADING_GUIDE.md)。

## 📖 文档

完整的项目文档位于 [`docs`](./docs/) 目录中：

- 📋 [文档中心](./docs/README.md) - 所有文档的索引和导航
- 🚀 [功能特性](./docs/features/) - 各个功能的详细说明
- 📖 [使用指南](./docs/guides/) - 安装、配置和使用指南
- 🛠️ [开发文档](./docs/development/) - 开发相关的技术文档
- 📦 [组件文档](./docs/components/) - 组件架构和API说明

### 快速链接

- [AI配置指南](./docs/guides/AI_CONFIGURATION_GUIDE.md) - 如何配置各种AI服务
- [扩展加载指南](./docs/guides/EXTENSION_LOADING_GUIDE.md) - 如何在浏览器中加载扩展
- [关于页面功能](./docs/features/ABOUT_PAGE_FEATURE.md) - 关于页面的实现说明

## 🏗️ 项目结构

```
extension-sidebar/
├── src/                    # 源代码
│   ├── pages/             # 页面组件
│   │   ├── about/         # 关于页面
│   │   ├── chat/          # 聊天页面
│   │   ├── history/       # 历史记录页面
│   │   ├── knowledge/     # 知识库页面
│   │   ├── search/        # 搜索页面
│   │   ├── settings/      # 设置页面
│   │   └── sidepanel/     # 侧边栏主页面
│   ├── components/        # 公共组件
│   ├── router/           # 路由配置
│   ├── stores/           # 状态管理
│   ├── utils/            # 工具函数
│   └── assets/           # 静态资源
├── docs/                 # 项目文档
│   ├── features/         # 功能特性文档
│   ├── guides/           # 使用指南
│   ├── development/      # 开发文档
│   └── components/       # 组件文档
├── public/               # 公共资源
└── dist/                 # 构建输出
```

## 🎯 使用说明

### AI 配置
1. 点击侧边栏的"设置"按钮
2. 在"AI配置"部分选择你的AI服务提供商
3. 输入相应的API密钥和配置信息
4. 点击"测试连接"验证配置

### 功能使用
- **智能问答**: 在聊天页面与AI助手对话
- **知识库**: 在知识库页面管理你的个人知识
- **内容检索**: 使用搜索功能快速找到相关内容
- **历史记录**: 查看和管理你的使用历史

详细使用说明请参考 [使用指南](./docs/guides/)。

## 🧪 开发和测试

### 开发命令
```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 运行测试
npm run test

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献
1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

### 开发规范
- 遵循现有的代码风格
- 为新功能添加相应的文档
- 确保所有测试通过
- 更新相关的README文件

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🔄 更新日志

### v1.0.0 (2024-10-20)
- ✨ 初始版本发布
- 🤖 实现智能问答功能
- 📚 完成知识库管理
- 🔍 添加内容检索功能
- 📝 实现历史记录管理
- ⚙️ 完善设置和配置功能
- 📖 添加关于页面
- 🎨 实现响应式设计

## ⭐ 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

如果这个项目对你有帮助，请给它一个 ⭐ Star！ 