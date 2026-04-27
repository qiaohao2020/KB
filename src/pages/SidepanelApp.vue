<template>
  <div class="sidepanel-app">
    <Layout />
  </div>
</template>

<script>
import Layout from '@/components/Layout.vue'

export default {
  name: 'SidepanelApp',
  components: {
    Layout
  },
  mounted() {
    // 监听来自popup的导航消息
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'NAVIGATE_TO') {
        // 使用路由导航
        this.$router.push({ name: message.page })
      }
    })
  }
}
</script>

<style scoped>
.sidepanel-app {
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}


</style>