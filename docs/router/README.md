# Vue Router 配置

本项目使用 Vue Router 4 来管理应用的路由导航。

## 路由配置

### 路由列表

- `/` - 重定向到 `/knowledge`
- `/knowledge` - 知识库页面
- `/search` - 内容检索页面  
- `/chat` - 智能问答页面
- `/history` - 历史记录页面
- `/settings` - 设置页面

### 路由模式

使用 `createWebHashHistory()` 模式，适合浏览器扩展环境：
- 不需要服务器配置
- 兼容性好
- 适合单页应用

### 路由元信息

每个路由都包含 `meta` 信息：
```javascript
meta: {
  title: '页面标题',  // 用于设置文档标题
  icon: 'bi bi-icon'  // Bootstrap Icons 图标类名
}
```

## 组件集成

### Sidebar 组件

使用 `router-link` 替代原来的点击事件：
```vue
<router-link
  :to="{ name: 'knowledge' }"
  class="nav-item"
  active-class="active"
>
  <i class="bi bi-book"></i>
  <span>知识库</span>
</router-link>
```

### Layout 组件

使用 `router-view` 渲染当前路由组件：
```vue
<main class="main-content">
  <router-view />
</main>
```

### SidepanelApp 组件

集成路由实例，监听来自 popup 的导航消息：
```javascript
// 监听来自popup的导航消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'NAVIGATE_TO') {
    this.$router.push({ name: message.page })
  }
})
```

## 路由守卫

### 全局前置守卫

设置页面标题：
```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `QuickSearch - ${to.meta.title}`
  }
  next()
})
```

## 使用方法

### 编程式导航

```javascript
// 通过路由名称导航
this.$router.push({ name: 'chat' })

// 通过路径导航
this.$router.push('/search')

// 带参数导航
this.$router.push({ 
  name: 'knowledge', 
  params: { id: 123 } 
})
```

### 声明式导航

```vue
<!-- 基本导航 -->
<router-link to="/chat">智能问答</router-link>

<!-- 命名路由 -->
<router-link :to="{ name: 'search' }">内容检索</router-link>

<!-- 自定义样式 -->
<router-link 
  to="/settings" 
  class="nav-link"
  active-class="active"
>
  设置
</router-link>
```

## 测试

路由配置包含完整的单元测试：
- 路由定义验证
- 重定向功能测试
- 元信息验证
- 组件集成测试

运行测试：
```bash
npm run test -- src/router/
```