<template>
  <div class="layout">
    <TopNavigation />
    <main class="main-content" :class="{ 'fullscreen': isFullscreenPage }">
      <router-view />
    </main>
  </div>
</template>

<script>
import TopNavigation from './TopNavigation.vue'

export default {
  name: 'Layout',
  components: {
    TopNavigation
  },
  computed: {
    isFullscreenPage() {
      // 检查当前路由是否为需要全屏显示的页面
      return this.$route.name === 'chat'
    }
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 20px;
}

/* 全屏页面样式 - 移除padding */
.main-content.fullscreen {
  padding: 0;
  overflow: hidden;
}

/* 深色主题支持 */
:global(.dark-theme) .main-content {
  background-color: #111827;
}
</style>