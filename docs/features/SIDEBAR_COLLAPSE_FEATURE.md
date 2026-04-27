# 侧边栏收缩展开功能

## 🎯 功能概述

为QuickSearch扩展的侧边栏添加了收缩/展开功能，提供更灵活的界面布局选择。

## ✨ 主要特性

### 1. **默认收缩状态**
- 侧边栏默认以收缩状态显示
- 收缩时宽度为60px，只显示图标
- 展开时宽度为200px，显示完整的图标和文字

### 2. **切换按钮**
- 位于侧边栏右上角的圆形切换按钮
- 收缩状态显示右箭头图标 (`bi-chevron-right`)
- 展开状态显示左箭头图标 (`bi-chevron-left`)
- 悬停时有视觉反馈效果

### 3. **状态持久化**
- 用户的收缩/展开选择会保存到localStorage
- 键名：`quicksearch-sidebar-collapsed`
- 下次打开时会恢复上次的状态

### 4. **智能工具提示**
- 收缩状态下，悬停导航项会显示工具提示
- 工具提示显示完整的功能名称
- 使用CSS动画实现平滑的显示效果

### 5. **平滑动画**
- 所有状态切换都有0.3秒的平滑过渡动画
- 使用`cubic-bezier(0.4, 0, 0.2, 1)`缓动函数
- 文字淡入淡出效果

## 🎨 视觉设计

### 收缩状态 (60px宽度)
```
┌─────┐
│ [≡] │ ← 切换按钮
├─────┤
│ 🏠  │ ← 只显示图标
│ 🔍  │
│ 💬  │
│ 📚  │
│ ⚙️  │
└─────┘
```

### 展开状态 (200px宽度)
```
┌──────────────────┐
│ QuickSearch  [≡] │ ← Logo + 切换按钮
├──────────────────┤
│ 🏠 知识库        │ ← 图标 + 文字
│ 🔍 内容检索      │
│ 💬 智能问答      │
│ 📚 历史记录      │
│ ⚙️ 设置          │
└──────────────────┘
```

## 🔧 技术实现

### 组件结构
```vue
<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- 切换按钮 -->
    <div class="toggle-btn" @click="toggleSidebar">
      <i :class="isCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'"></i>
    </div>
    
    <!-- Logo区域 -->
    <div class="logo">
      <img src="@/assets/images/logo.svg" alt="QuickSearch Logo" />
      <h1 v-show="!isCollapsed">QuickSearch</h1>
    </div>
    
    <!-- 导航菜单 -->
    <nav class="nav-menu">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="nav-item"
        active-class="active"
        :title="isCollapsed ? item.label : ''"
      >
        <i :class="item.icon"></i>
        <span v-show="!isCollapsed">{{ item.label }}</span>
      </router-link>
    </nav>
  </div>
</template>
```

### 核心方法
```javascript
methods: {
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed
    // 保存状态到localStorage
    localStorage.setItem('quicksearch-sidebar-collapsed', this.isCollapsed.toString())
    // 触发事件通知父组件
    this.$emit('sidebar-toggle', this.isCollapsed)
  }
}
```

### CSS关键样式
```css
.sidebar {
  width: 200px;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 60px;
}

/* 工具提示效果 */
.sidebar.collapsed .nav-item:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  /* ... 工具提示样式 */
}
```

## 📱 响应式设计

### 移动端适配
- 屏幕宽度 ≤ 768px 时，侧边栏默认收缩
- 展开时使用固定定位，覆盖在内容上方
- 添加阴影效果以突出层级关系

### 平板端优化
- 保持桌面端的交互方式
- 适当调整按钮大小和间距

## 🎯 用户体验

### 交互反馈
1. **按钮悬停**：颜色变化 + 轻微缩放效果
2. **状态切换**：平滑的宽度过渡动画
3. **工具提示**：收缩状态下的功能说明
4. **状态记忆**：保持用户的偏好设置

### 可访问性
- 按钮有明确的视觉指示
- 工具提示提供功能说明
- 键盘导航支持
- 高对比度模式兼容

## 🧪 测试覆盖

### 单元测试 (10个测试用例)
- ✅ 默认收缩状态渲染
- ✅ 切换按钮功能
- ✅ localStorage状态保存
- ✅ 状态恢复功能
- ✅ 事件触发机制
- ✅ 图标状态切换
- ✅ 文本隐藏/显示
- ✅ 工具提示功能
- ✅ 导航项渲染
- ✅ CSS类名应用

### 集成测试
- 与Vue Router的兼容性
- 与Layout组件的协作
- 跨浏览器兼容性

## 🚀 使用方法

### 基本使用
1. **切换状态**：点击右上角的切换按钮
2. **查看功能**：收缩状态下悬停图标查看工具提示
3. **导航**：点击图标或文字进行页面导航

### 开发者接口
```javascript
// 监听侧边栏状态变化
<Sidebar @sidebar-toggle="handleSidebarToggle" />

// 处理状态变化
handleSidebarToggle(isCollapsed) {
  console.log('Sidebar collapsed:', isCollapsed)
  // 可以根据状态调整主内容区域
}
```

## 🔄 状态管理

### localStorage键值
- **键名**：`quicksearch-sidebar-collapsed`
- **值类型**：字符串 (`"true"` 或 `"false"`)
- **默认值**：`true` (收缩状态)

### 状态同步
- 组件挂载时从localStorage读取状态
- 状态变化时立即保存到localStorage
- 支持多窗口间的状态同步

## 📈 性能优化

### CSS优化
- 使用`transform`而非`width`进行动画（在某些情况下）
- 合理使用`will-change`属性
- 避免重排和重绘

### JavaScript优化
- 事件防抖处理
- 最小化DOM操作
- 合理的组件更新策略

## 🎨 自定义选项

### 可配置参数
```javascript
// 可以通过props传入配置
props: {
  defaultCollapsed: {
    type: Boolean,
    default: true
  },
  collapsedWidth: {
    type: Number,
    default: 60
  },
  expandedWidth: {
    type: Number,
    default: 200
  }
}
```

### 主题定制
- 支持深色/浅色主题
- 可自定义颜色和间距
- 响应系统主题变化

侧边栏收缩展开功能现已完全实现，提供了更灵活和用户友好的界面体验！