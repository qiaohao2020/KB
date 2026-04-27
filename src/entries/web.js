import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'

// 导入页面组件
import ChatPage from '../pages/ChatPage.vue'
import KnowledgePage from '../pages/KnowledgePage.vue'
import HistoryPage from '../pages/HistoryPage.vue'
import SearchPage from '../pages/SearchPage.vue'
import SettingsPage from '../pages/SettingsPage.vue'
import AboutPage from '../pages/AboutPage.vue'

// 导入Web版本专用样式
import '../assets/css/web.css'

// 创建欢迎页面组件
const WelcomePage = {
  name: 'WelcomePage',
  template: `
    <div class="welcome-screen">
      <i class="bi bi-lightning-charge-fill"></i>
      <h1>欢迎使用 QuickSearch</h1>
      <p>一个强大的AI智能助手，帮助您快速搜索、聊天和管理知识库</p>
      
      <div class="feature-grid">
        <div class="feature-card" @click="navigateTo('/chat')">
          <i class="bi bi-chat-dots"></i>
          <h3>AI 聊天</h3>
          <p>与AI助手进行智能对话，获取即时帮助和答案</p>
        </div>
        
        <div class="feature-card" @click="navigateTo('/knowledge')">
          <i class="bi bi-book"></i>
          <h3>知识库</h3>
          <p>管理和组织您的知识内容，构建个人知识体系</p>
        </div>
        
        <div class="feature-card" @click="navigateTo('/search')">
          <i class="bi bi-search"></i>
          <h3>智能搜索</h3>
          <p>快速搜索和查找信息，提高工作效率</p>
        </div>
        
        <div class="feature-card" @click="navigateTo('/history')">
          <i class="bi bi-clock-history"></i>
          <h3>历史记录</h3>
          <p>查看和管理聊天历史，随时回顾重要对话</p>
        </div>
      </div>
    </div>
  `,
  methods: {
    navigateTo(path) {
      this.$router.push(path)
    }
  }
}

// 创建主应用组件
const App = {
  name: 'App',
  template: `
    <div id="app">
      <!-- 顶部导航 -->
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

      <!-- 移动端菜单 -->
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

      <!-- 主内容区域 -->
      <div class="main-container">
        <div class="content-area">
          <router-view />
        </div>
      </div>
    </div>
  `,
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

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WelcomePage
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatPage
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: KnowledgePage
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryPage
    },
    {
      path: '/search',
      name: 'search',
      component: SearchPage
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage
    }
  ]
})

// 创建Pinia store
const pinia = createPinia()

// 创建并挂载应用
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
