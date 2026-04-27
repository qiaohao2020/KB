<template>
  <div class="top-navigation">
    <!-- Logo和标题区域 -->
    <div class="nav-header">
      <img src="@/assets/images/logo.svg" alt="QuickSearch Logo" class="logo" />
      <h1 class="title">QuickSearch</h1>
    </div>
    
    <!-- 导航菜单 -->
    <nav class="nav-menu">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="nav-item"
        active-class="active"
        :title="item.label"
      >
        <i :class="item.icon"></i>
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>
    
    <!-- 右侧操作区域 -->
    <div class="nav-actions">
      <button class="action-btn" @click="toggleTheme" title="切换主题">
        <i class="bi bi-moon"></i>
      </button>
      <button class="action-btn" @click="openSettings" title="设置">
        <i class="bi bi-gear"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopNavigation',
  data() {
    return {
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
          name: 'about',
          label: '关于',
          icon: 'bi bi-info-circle'
        }
      ]
    }
  },
  methods: {
    toggleTheme() {
      // 主题切换逻辑
      const root = document.documentElement
      const isDark = root.classList.contains('dark-theme')
      
      if (isDark) {
        root.classList.remove('dark-theme')
        localStorage.setItem('quicksearch-theme', 'light')
      } else {
        root.classList.add('dark-theme')
        localStorage.setItem('quicksearch-theme', 'dark')
      }
    },
    
    openSettings() {
      // 导航到设置页面
      this.$router.push({ name: 'settings' })
    }
  },
  
  mounted() {
    // 恢复主题设置
    const savedTheme = localStorage.getItem('quicksearch-theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme')
    }
  }
}
</script>

<style scoped>
.top-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Logo和标题区域 */
.nav-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 6px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  white-space: nowrap;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
  max-width: 600px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
}

.nav-item:hover {
  background-color: #f1f5f9;
  color: #333;
  transform: translateY(-1px);
}

.nav-item.active {
  background-color: #4a6cf7;
  color: white;
  box-shadow: 0 2px 8px rgba(74, 108, 247, 0.3);
}

.nav-item i {
  font-size: 16px;
  flex-shrink: 0;
}

.nav-label {
  font-size: 13px;
  font-weight: 500;
}

/* 右侧操作区域 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: #f1f5f9;
  color: #333;
  transform: translateY(-1px);
}

.action-btn i {
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-navigation {
    padding: 0 12px;
    height: 56px;
  }
  
  .nav-header .title {
    display: none;
  }
  
  .nav-menu {
    gap: 4px;
  }
  
  .nav-item {
    padding: 6px 12px;
    gap: 6px;
  }
  
  .nav-label {
    display: none;
  }
  
  .nav-item i {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    gap: 2px;
  }
  
  .nav-item {
    padding: 6px 8px;
  }
  
  .action-btn {
    width: 32px;
    height: 32px;
  }
}

/* 深色主题支持 */
:global(.dark-theme) .top-navigation {
  background: #1f2937;
  border-bottom-color: #374151;
}

:global(.dark-theme) .title {
  color: #f9fafb;
}

:global(.dark-theme) .nav-item {
  color: #d1d5db;
}

:global(.dark-theme) .nav-item:hover {
  background-color: #374151;
  color: #f9fafb;
}

:global(.dark-theme) .nav-item.active {
  background-color: #4a6cf7;
  color: white;
}

:global(.dark-theme) .action-btn {
  color: #d1d5db;
}

:global(.dark-theme) .action-btn:hover {
  background-color: #374151;
  color: #f9fafb;
}

/* 动画效果 */
.nav-item {
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item.active::before {
  display: none;
}
</style>