<template>
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
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    navigateTo(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  text-align: center;
}

.welcome-screen i {
  font-size: 80px;
  color: #4a6cf7;
  margin-bottom: 24px;
}

.welcome-screen h1 {
  font-size: 36px;
  color: #2d3748;
  margin-bottom: 16px;
}

.welcome-screen p {
  font-size: 18px;
  color: #718096;
  max-width: 600px;
  line-height: 1.6;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 48px;
  max-width: 1000px;
  width: 100%;
}

.feature-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-card i {
  font-size: 40px;
  color: #4a6cf7;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 18px;
  color: #2d3748;
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 14px;
  color: #718096;
  line-height: 1.5;
}
</style>
