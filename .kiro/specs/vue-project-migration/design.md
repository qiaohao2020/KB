# Design Document

## Overview

将现有的浏览器扩展项目从静态HTML/JavaScript架构迁移到现代化的Vue.js项目。项目当前使用传统的HTML页面和内联JavaScript，需要重构为组件化的Vue应用，同时保持浏览器扩展的所有功能。

基于现有代码分析，项目包含以下主要功能：
- 浏览器扩展popup界面
- 侧边栏聊天功能
- 知识库管理
- 内容搜索
- 历史记录
- 设置页面

## Architecture

### 整体架构设计

```
vue-browser-extension/
├── src/
│   ├── components/           # Vue组件
│   │   ├── common/          # 通用组件
│   │   ├── chat/            # 聊天相关组件
│   │   ├── knowledge/       # 知识库组件
│   │   └── search/          # 搜索组件
│   ├── pages/               # 页面级组件
│   │   ├── popup/           # 扩展popup页面
│   │   ├── sidepanel/       # 侧边栏页面
│   │   └── options/         # 设置页面
│   ├── utils/               # 工具函数
│   ├── stores/              # 状态管理
│   ├── assets/              # 静态资源
│   ├── background.js        # 后台脚本
│   ├── content.js           # 内容脚本
│   └── manifest.json        # 扩展配置
├── public/                  # 公共资源
├── dist/                    # 构建输出
├── vite.config.js           # Vite配置
├── package.json
└── jsconfig.json
```

### 技术栈选择

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **语言**: JavaScript (ES6+)
- **状态管理**: Pinia
- **路由**: Vue Router (用于多页面导航)
- **UI组件**: 自定义组件 + Bootstrap Icons
- **样式**: CSS Modules / SCSS

## Components and Interfaces

### 核心组件设计

#### 1. 通用组件 (Common Components)

**Sidebar Component**
```javascript
// Props定义
const sidebarProps = {
  currentPage: String,
  onNavigate: Function
}
```

**Message Component**
```javascript
// Props定义
const messageProps = {
  message: {
    type: Object,
    required: true,
    // message对象包含: id, type, content, timestamp, sender
  }
}
```

#### 2. 页面组件 (Page Components)

**Popup Page**
- 简单的扩展入口界面
- 提供打开侧边栏的功能

**Sidepanel Page**
- 主要的应用界面
- 包含路由导航
- 集成所有功能模块

**Chat Page**
- 聊天界面组件
- 消息列表和输入框
- 实时消息处理

#### 3. 功能组件 (Feature Components)

**ChatContainer**
```javascript
// 状态定义
const chatState = {
  messages: [], // 消息数组
  isLoading: false, // 加载状态
  currentChat: '' // 当前聊天ID
}
```

**KnowledgeBase**
```javascript
// 状态定义
const knowledgeState = {
  documents: [], // 文档数组
  categories: [], // 分类数组
  searchQuery: '' // 搜索查询
}
```

## Data Models

### 消息模型
```javascript
// 消息对象结构
const messageSchema = {
  id: '', // 唯一标识
  type: '', // 'user' | 'ai' | 'system'
  content: '', // 消息内容
  timestamp: new Date(), // 时间戳
  sender: '', // 发送者
  chatId: '' // 所属聊天ID
}
```

### 聊天会话模型
```javascript
// 聊天会话对象结构
const chatSessionSchema = {
  id: '', // 会话ID
  title: '', // 会话标题
  messages: [], // 消息数组
  createdAt: new Date(), // 创建时间
  updatedAt: new Date() // 更新时间
}
```

### 知识库文档模型
```javascript
// 文档对象结构
const documentSchema = {
  id: '', // 文档ID
  title: '', // 文档标题
  content: '', // 文档内容
  category: '', // 分类
  tags: [], // 标签数组
  createdAt: new Date(), // 创建时间
  updatedAt: new Date() // 更新时间
}
```

### 用户设置模型
```javascript
// 用户设置对象结构
const userSettingsSchema = {
  theme: 'light', // 'light' | 'dark'
  language: 'zh-CN', // 语言设置
  autoSave: true, // 自动保存
  notifications: true // 通知开关
}
```

## Error Handling

### 错误类型定义
```javascript
// 错误类型常量
const ErrorType = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR'
}

// 应用错误对象结构
const appErrorSchema = {
  type: '', // 错误类型
  message: '', // 错误消息
  details: null, // 错误详情
  timestamp: new Date() // 时间戳
}
```

### 错误处理策略
1. **全局错误处理**: 使用Vue的全局错误处理器
2. **组件级错误**: 使用错误边界组件
3. **异步错误**: Promise rejection处理
4. **用户友好提示**: 错误消息本地化

## Testing Strategy

### 单元测试
- 使用Vitest作为测试框架
- 测试所有工具函数和组件逻辑
- Mock浏览器扩展API

### 组件测试
- 使用Vue Test Utils
- 测试组件渲染和交互
- 测试组件间通信

### 集成测试
- 测试页面级功能
- 测试状态管理
- 测试路由导航

### E2E测试
- 使用Playwright
- 测试完整的用户流程
- 测试浏览器扩展功能

## 构建和部署配置

### Vite配置要点
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        popup: 'src/pages/popup/index.html',
        sidepanel: 'src/pages/sidepanel/index.html',
        background: 'src/background.js',
        content: 'src/content.js'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});
```

### 浏览器扩展特殊处理
1. **Manifest V3兼容**: 确保所有配置符合Manifest V3规范
2. **CSP限制**: 处理内容安全策略限制
3. **动态导入**: 处理扩展环境下的模块加载
4. **权限管理**: 正确配置和使用扩展权限

## 迁移策略

### 阶段1: 项目结构重组
- 建立Vue项目基础结构
- 配置构建工具和开发环境
- 迁移静态资源

### 阶段2: 组件化重构
- 将HTML页面转换为Vue组件
- 重构JavaScript逻辑为Composition API
- 建立组件间通信机制

### 阶段3: 状态管理
- 实现Pinia状态管理
- 迁移本地存储逻辑
- 建立数据持久化机制

### 阶段4: 功能完善
- 实现路由导航
- 优化用户体验
- 添加错误处理和测试

### 阶段5: 优化和部署
- 性能优化
- 构建配置优化
- 部署和发布流程