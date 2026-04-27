<template>
  <div id="app">
    <nav class="top-nav">
      <router-link to="/" class="nav-brand">
        <i class="bi bi-lightning-charge-fill"></i>
        <span>QuickSearch</span>
      </router-link>
      
      <ul class="nav-menu">
        <li class="nav-item" :class="{ active: $route.name === 'chat' }" @click="$router.push('/chat')">
          <i class="bi bi-chat-dots"></i>
          <span>聊天</span>
        </li>
        <li class="nav-item" :class="{ active: $route.name === 'knowledge' }" @click="$router.push('/knowledge')">
          <i class="bi bi-book"></i>
          <span>知识库</span>
        </li>
        <li class="nav-item" :class="{ active: $route.name === 'search' }" @click="$router.push('/search')">
          <i class="bi bi-search"></i>
          <span>搜索</span>
        </li>
        <li class="nav-item" :class="{ active: $route.name === 'history' }" @click="$router.push('/history')">
          <i class="bi bi-clock-history"></i>
          <span>历史</span>
        </li>
        <li class="nav-item" :class="{ active: $route.name === 'settings' }" @click="$router.push('/settings')">
          <i class="bi bi-gear"></i>
          <span>设置</span>
        </li>
        <li class="nav-item" :class="{ active: $route.name === 'about' }" @click="$router.push('/about')">
          <i class="bi bi-info-circle"></i>
          <span>关于</span>
        </li>
      </ul>
      
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <i class="bi bi-list"></i>
      </button>
    </nav>

    <div class="mobile-menu" v-if="showMobileMenu" @click="toggleMobileMenu">
      <div class="mobile-menu-content" @click.stop>
        <div class="mobile-menu-header">
          <h3>菜单</h3>
          <button @click="toggleMobileMenu">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <ul class="mobile-menu-list">
          <li @click="navigateAndClose('/chat')">
            <i class="bi bi-chat-dots"></i>
            <span>聊天</span>
          </li>
          <li @click="navigateAndClose('/knowledge')">
            <i class="bi bi-book"></i>
            <span>知识库</span>
          </li>
          <li @click="navigateAndClose('/search')">
            <i class="bi bi-search"></i>
            <span>搜索</span>
          </li>
          <li @click="navigateAndClose('/history')">
            <i class="bi bi-clock-history"></i>
            <span>历史</span>
          </li>
          <li @click="navigateAndClose('/settings')">
            <i class="bi bi-gear"></i>
            <span>设置</span>
          </li>
          <li @click="navigateAndClose('/about')">
            <i class="bi bi-info-circle"></i>
            <span>关于</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="main-container">
      <div class="content-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showMobileMenu: false
    }
  },
  methods: {
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu
    },
    navigateAndClose(path) {
      this.$router.push(path)
      this.showMobileMenu = false
    }
  }
}
</script>

<style scoped>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-nav {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #4a6cf7;
  text-decoration: none;
}

.nav-brand i {
  font-size: 28px;
}

.nav-menu {
  display: flex;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  font-weight: 500;
  font-size: 14px;
}

.nav-item:hover {
  background: rgba(74, 108, 247, 0.1);
  color: #4a6cf7;
}

.nav-item.active {
  background: rgba(74, 108, 247, 0.15);
  color: #4a6cf7;
}

.nav-item i {
  font-size: 18px;
}

.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(74, 108, 247, 0.1);
  color: #4a6cf7;
  cursor: pointer;
  border: none;
  font-size: 20px;
}

.mobile-menu-btn:hover {
  background: rgba(74, 108, 247, 0.2);
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
}

.mobile-menu-content {
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.mobile-menu-header h3 {
  margin: 0;
  color: #2d3748;
}

.mobile-menu-header button {
  background: none;
  border: none;
  color: #4a5568;
  cursor: pointer;
  font-size: 20px;
}

.mobile-menu-list {
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.mobile-menu-list li {
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #4a5568;
  transition: all 0.2s ease;
}

.mobile-menu-list li:hover {
  background: rgba(74, 108, 247, 0.1);
  color: #4a6cf7;
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f7fafc;
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  .mobile-menu-btn {
    display: flex;
  }
}
</style>
