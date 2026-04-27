import { createApp } from 'vue'
import Popup from '@/pages/Popup.vue'
import '@/assets/css/global.css'

const app = createApp(Popup)

// 全局错误处理
app.config.errorHandler = (error, instance, info) => {
  console.error('Popup error:', error, info)
}

app.mount('#app')