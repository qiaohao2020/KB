import { createApp } from 'vue'
import SidepanelApp from '@/pages/SidepanelApp.vue'
import router from '@/router'
import '@/assets/css/global.css'

const app = createApp(SidepanelApp)

// 使用路由
app.use(router)

// 全局错误处理
app.config.errorHandler = (error, instance, info) => {
  console.error('Sidepanel error:', error, info)
}

app.mount('#app')