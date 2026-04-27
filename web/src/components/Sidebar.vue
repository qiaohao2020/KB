<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- 收缩/展开按钮 -->
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

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      isCollapsed: true, // 默认收缩状态
      navItems: [
        {
          name: 'knowledge',
          label: '知识库',
          icon: 'bi bi-book'
        },
        {
          name: 'search',
          label: '内容检索',
          icon: 'bi bi-search'
        },
        {
          name: 'chat',
          label: '智能问答',
          icon: 'bi bi-chat-dots'
        },
        {
          name: 'history',
          label: '历史记录',
          icon: 'bi bi-clock-history'
        },
        {
          name: 'settings',
          label: '设置',
          icon: 'bi bi-gear'
        },
        {
          name: 'about',
          label: '关于',
          icon: 'bi bi-info-circle'
        }
      ]
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed
      // 保存状态到localStorage
      localStorage.setItem('quicksearch-sidebar-collapsed', this.isCollapsed.toString())
      
      // 触发事件通知父组件侧边栏状态变化
      this.$emit('sidebar-toggle', this.isCollapsed)
    }
  },
  mounted() {
    // 从localStorage恢复侧边栏状态
    const savedState = localStorage.getItem('quicksearch-sidebar-collapsed')
    if (savedState !== null) {
      this.isCollapsed = savedState === 'true'
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  height: 100vh;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 60px;
}

/* 收缩/展开按钮 */
.toggle-btn {
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-btn:hover {
  background: #4a6cf7;
  color: white;
  border-color: #4a6cf7;
  transform: translateY(-50%) scale(1.1);
}

.toggle-btn i {
  font-size: 12px;
  transition: transform 0.2s ease;
}

/* Logo区域 */
.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.sidebar.collapsed .logo {
  padding: 20px 10px;
}

.logo img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.sidebar.collapsed .logo img {
  margin-bottom: 0;
  width: 32px;
  height: 32px;
}

.logo h1 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
}

/* 导航菜单 */
.nav-menu {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
  text-decoration: none;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar.collapsed .nav-item {
  padding: 12px;
  justify-content: center;
}

.nav-item:hover {
  background-color: #e9ecef;
  color: #333;
}

.nav-item.active {
  background-color: #4a6cf7;
  color: white;
}

.nav-item i {
  margin-right: 12px;
  font-size: 16px;
  transition: margin 0.3s ease;
  flex-shrink: 0;
}

.sidebar.collapsed .nav-item i {
  margin-right: 0;
}

.nav-item span {
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.3s ease;
  overflow: hidden;
}

/* 收缩状态下的工具提示效果 */
.sidebar.collapsed .nav-item {
  position: relative;
}

.sidebar.collapsed .nav-item:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  margin-left: 8px;
  opacity: 0;
  animation: tooltipFadeIn 0.2s ease forwards;
}

.sidebar.collapsed .nav-item:hover::before {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-right-color: #333;
  z-index: 1000;
  margin-left: 2px;
  opacity: 0;
  animation: tooltipFadeIn 0.2s ease forwards;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
  
  .sidebar.collapsed {
    width: 60px;
  }
  
  .sidebar:not(.collapsed) {
    width: 200px;
    position: fixed;
    z-index: 1000;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .toggle-btn {
    display: block;
  }
}

/* 平滑过渡动画 */
.sidebar * {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 收缩状态下隐藏文本的动画 */
.sidebar.collapsed .logo h1,
.sidebar.collapsed .nav-item span {
  opacity: 0;
  width: 0;
  margin: 0;
  padding: 0;
}

/* 展开状态下显示文本的动画 */
.sidebar:not(.collapsed) .logo h1,
.sidebar:not(.collapsed) .nav-item span {
  opacity: 1;
}

/* 确保图标在收缩状态下居中 */
.sidebar.collapsed .nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 活跃状态的特殊样式 */
.sidebar.collapsed .nav-item.active {
  background-color: #4a6cf7;
  position: relative;
}

.sidebar.collapsed .nav-item.active::after {
  background-color: #333 !important;
}

/* 收缩按钮的特殊状态 */
.sidebar.collapsed .toggle-btn {
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
}

.sidebar:not(.collapsed) .toggle-btn {
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
}
</style>