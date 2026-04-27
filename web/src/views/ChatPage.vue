<template>
  <div class="chat-page">
    <ChatContainer />
  </div>
</template>

<script>
import ChatContainer from '@/components/ChatContainer.vue'

export default {
  name: 'ChatPage',
  components: {
    ChatContainer
  }
}
</script>

<style scoped>
.chat-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  /* 移除背景渐变，让聊天容器自己处理背景 */
}
</style>