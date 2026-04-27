import { createRouter, createWebHashHistory } from 'vue-router'

// 页面组件懒加载
const KnowledgePage = () => import('@/pages/KnowledgePage.vue')
const SearchPage = () => import('@/pages/SearchPage.vue')
const ChatPage = () => import('@/pages/ChatPage.vue')
const HistoryPage = () => import('@/pages/HistoryPage.vue')
const SettingsPage = () => import('@/pages/SettingsPage.vue')
const AboutPage = () => import('@/pages/AboutPage.vue')

const routes = [
  {
    path: '/',
    redirect: '/knowledge'
  },
  {
    path: '/knowledge',
    name: 'knowledge',
    component: KnowledgePage,
    meta: {
      title: '知识库',
      icon: 'bi bi-book'
    }
  },
  {
    path: '/search',
    name: 'search',
    component: SearchPage,
    meta: {
      title: '内容检索',
      icon: 'bi bi-search'
    }
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatPage,
    meta: {
      title: '智能问答',
      icon: 'bi bi-chat-dots'
    }
  },
  {
    path: '/history',
    name: 'history',
    component: HistoryPage,
    meta: {
      title: '历史记录',
      icon: 'bi bi-clock-history'
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage,
    meta: {
      title: '设置',
      icon: 'bi bi-gear'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
    meta: {
      title: '关于',
      icon: 'bi bi-info-circle'
    }
  }
]

const router = createRouter({
  // 使用 hash 模式，适合浏览器扩展环境
  history: createWebHashHistory(),
  routes
})

// 路由守卫 - 可以在这里添加权限检查等逻辑
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `QuickSearch - ${to.meta.title}`
  }
  next()
})

export default router