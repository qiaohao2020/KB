# QuickSearch 完整文档

> 最后更新: 2024年10月22日

## 📚 目录

- [项目概述](#项目概述)
- [快速开始](#快速开始)
- [功能特性](#功能特性)
- [开发指南](#开发指南)
- [API配置](#api配置)
- [组件文档](#组件文档)
- [常见问题](#常见问题)

---

## 项目概述

**QuickSearch** 是一个现代化的AI智能浏览器扩展，集成了聊天、知识库管理、内容检索和历史记录等功能。

### 核心特性
- 🤖 AI智能问答 - 支持多个AI服务提供商
- 📚 知识库管理 - 组织和管理个人知识内容
- 🔍 内容检索 - 快速搜索和查找信息
- 📋 历史记录 - 查看和管理使用历史
- ⚙️ 灵活配置 - 支持多种AI服务和模型

### 技术栈
- **前端框架**: Vue 3 + Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **样式**: CSS3 + 响应式设计
- **构建工具**: Vite
- **测试**: Vitest

---

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发构建
```bash
npm run build
```

### 加载扩展
1. 打开 `chrome://extensions/`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目的 `dist` 文件夹

### 运行测试
```bash
npm run test
```

---

## 功能特性

### 1. 智能问答 (Chat)

#### 核心功能
- **预设Prompt库**: 5个内置对话模板
- **自定义Prompt**: 创建和管理个性化模板
- **消息操作**: 复制、点赞、重新生成
- **拖拽调整**: 可调节的输入框高度
- **快捷键支持**: Ctrl+Enter 发送消息

#### 预设模板
1. **代码解释** - 解释代码功能和改进建议
2. **文档总结** - 提取文档关键信息
3. **问题分析** - 分析问题并提供解决方案
4. **创意写作** - 创意内容生成
5. **学习辅导** - 知识点讲解

#### 界面优化
- 全屏无边框设计，最大化显示空间
- 现代化的消息气泡设计
- 平滑的动画过渡效果
- 响应式布局适配各种屏幕

### 2. 知识库管理 (Knowledge)

#### 功能
- 分类树形结构
- 知识内容编辑
- 拖拽调整侧边栏宽度
- 搜索和过滤

#### 侧边栏特性
- 可拖拽调整宽度 (200px - 500px)
- 折叠/展开功能
- 状态持久化保存
- 响应式设计

### 3. 内容检索 (Search)

#### 功能
- 全文搜索
- 高级搜索选项
- 搜索历史记录
- 结果预览

### 4. 历史记录 (History)

#### 功能
- 查看使用历史
- 搜索历史内容
- 清除历史记录
- 导出历史数据

### 5. 设置 (Settings)

#### AI配置
- 支持多个AI提供商
- 自定义API端点
- 模型选择
- 参数调整

#### 支持的AI服务
- **OpenAI**: GPT-4o, GPT-3.5 Turbo等
- **Azure OpenAI**: 企业级部署
- **Anthropic Claude**: Claude 3系列
- **自定义API**: 兼容OpenAI格式

---

## 开发指南

### 项目结构

```
src/
├── entries/              # 浏览器扩展入口
│   ├── popup.html/js    # 弹窗入口
│   ├── sidepanel.html/js # 侧边栏入口
│   └── options.html/js  # 选项页入口
├── pages/               # 页面组件
│   ├── ChatPage.vue
│   ├── KnowledgePage.vue
│   ├── SearchPage.vue
│   ├── HistoryPage.vue
│   ├── SettingsPage.vue
│   └── AboutPage.vue
├── components/          # 可复用组件
│   ├── ChatContainer.vue
│   ├── Message.vue
│   ├── MessageInput.vue
│   ├── CategoryTree.vue
│   ├── Layout.vue
│   └── Sidebar.vue
├── assets/              # 静态资源
│   ├── css/            # 样式文件
│   ├── images/         # 图标和图片
│   └── js/             # 工具脚本
├── router.js           # 路由配置
├── background.js       # 后台脚本
├── content.js          # 内容脚本
└── manifest.json       # 扩展清单
```

### 核心组件

#### ChatContainer
智能问答的主容器组件，包含：
- 消息显示区域
- 消息输入框
- Prompt管理
- 对话历史

#### MessageInput
消息输入组件，支持：
- 多行输入
- 拖拽调整高度
- 快捷键操作
- 字数统计

#### PromptDialog
Prompt编辑对话框，支持：
- 添加新Prompt
- 编辑现有Prompt
- 表单验证
- 键盘快捷键

#### CategoryTree
知识库分类树组件，支持：
- 树形结构展示
- 拖拽调整宽度
- 折叠/展开
- 搜索过滤

### 路由配置

```javascript
// src/router.js
const routes = [
  { path: '/', redirect: '/knowledge' },
  { path: '/knowledge', name: 'knowledge', component: KnowledgePage },
  { path: '/search', name: 'search', component: SearchPage },
  { path: '/chat', name: 'chat', component: ChatPage },
  { path: '/history', name: 'history', component: HistoryPage },
  { path: '/settings', name: 'settings', component: SettingsPage },
  { path: '/about', name: 'about', component: AboutPage }
]
```

### 样式系统

#### 颜色方案
- **主色调**: `#4a6cf7` (蓝色)
- **辅助色**: `#38a169` (绿色)
- **背景色**: `#ffffff` (白色)
- **文本色**: `#2d3748` (深灰)

#### 响应式断点
- **桌面端**: > 1024px
- **平板端**: 768px - 1024px
- **移动端**: < 768px

---

## API配置

### OpenAI配置

```javascript
{
  provider: 'openai',
  apiKey: 'sk-...',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 4000
}
```

### Azure OpenAI配置

```javascript
{
  provider: 'azure',
  apiKey: '...',
  baseUrl: 'https://your-resource.openai.azure.com',
  apiVersion: '2024-02-15-preview',
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 4000
}
```

### Claude配置

```javascript
{
  provider: 'anthropic',
  apiKey: 'sk-ant-...',
  baseUrl: 'https://api.anthropic.com',
  model: 'claude-3-5-sonnet-20241022',
  temperature: 0.7,
  maxTokens: 4000
}
```

---

## 组件文档

### ChatContainer

**Props**: 无

**Events**:
- `send-message` - 发送消息
- `toggle-prompts` - 切换Prompt显示
- `use-prompt` - 使用Prompt

**功能**:
- 管理聊天消息
- Prompt管理
- 消息显示和输入

### Message

**Props**:
- `message` (Object) - 消息对象

**消息结构**:
```javascript
{
  type: 'user' | 'ai',
  sender: string,
  text: string,
  time: string
}
```

### MessageInput

**Props**:
- `isLoading` (Boolean) - 加载状态
- `prompts` (Array) - Prompt列表
- `showPrompts` (Boolean) - 显示Prompt

**Events**:
- `send-message` - 发送消息
- `use-prompt` - 使用Prompt
- `show-add-prompt` - 显示添加对话框

### CategoryTree

**Props**:
- `categories` (Array) - 分类列表
- `selectedCategory` (String) - 选中分类

**Events**:
- `category-selected` - 选择分类
- `add-category` - 添加分类
- `width-changed` - 宽度变化

---

## 常见问题

### Q: 如何添加自定义Prompt?
A: 在聊天页面点击"+"按钮，在对话框中输入名称和内容，点击"添加"即可。

### Q: 如何配置AI服务?
A: 进入设置页面，选择AI提供商，输入API Key和其他配置信息，点击"测试连接"验证。

### Q: 支持哪些AI模型?
A: 支持OpenAI (GPT-4o等)、Azure OpenAI、Anthropic Claude等多个提供商的模型。

### Q: 如何调整聊天输入框的高度?
A: 在聊天页面顶部有一个拖拽手柄，可以拖拽调整输入框高度。

### Q: 如何折叠侧边栏?
A: 点击侧边栏右上角的箭头按钮可以折叠/展开侧边栏。

### Q: 数据会被保存吗?
A: 自定义Prompt和设置会保存到浏览器的localStorage中。

### Q: 如何导出历史记录?
A: 在历史记录页面点击"导出"按钮可以导出为JSON文件。

### Q: 支持离线使用吗?
A: 不支持。需要连接到互联网才能使用AI功能。

---

## 开发历史

### 最近更新

#### 2024年10月22日
- ✅ 修复ChatPage访问异常
- ✅ 优化聊天输入布局
- ✅ 实现全屏聊天显示
- ✅ 添加顶部导航栏

#### 2024年10月20日
- ✅ 重构文档目录结构
- ✅ 简化文件路径
- ✅ 清理.gitkeep文件
- ✅ 重组Vue文件结构

#### 2024年10月15日
- ✅ 添加关于页面
- ✅ 实现Prompt预设功能
- ✅ 优化知识库侧边栏
- ✅ 添加历史记录功能

---

## 许可证

MIT License

---

## 联系方式

如有问题或建议，欢迎提交Issue或Pull Request。

---

*本文档由 Kiro AI Assistant 生成和维护*
