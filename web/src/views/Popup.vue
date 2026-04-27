<template>
  <div class="popup-container">
    <div class="popup-header">
      <img src="@/assets/images/logo.svg" alt="QuickSearch Logo" class="logo" />
      <h2>QuickSearch</h2>
    </div>
    
    <div class="popup-content">
      <p class="description">智能聊天助手，随时为您提供帮助</p>
      
      <button 
        class="open-sidebar-btn"
        @click="openSidebar"
        :disabled="isLoading"
      >
        <i class="bi bi-chat-dots"></i>
        {{ isLoading ? '正在打开...' : '打开侧边栏' }}
      </button>
      
      <div class="quick-actions">
        <button class="quick-btn" @click="quickAction('search')">
          <i class="bi bi-search"></i>
          快速搜索
        </button>
        <button class="quick-btn" @click="quickAction('knowledge')">
          <i class="bi bi-book"></i>
          知识库
        </button>
      </div>
    </div>
    
    <div class="popup-footer">
      <small>点击按钮打开完整功能面板</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    async openSidebar() {
      try {
        this.isLoading = true
        
        // 获取当前标签页
        const [tab] = await chrome.tabs.query({ 
          active: true, 
          currentWindow: true 
        })
        
        // 打开侧边栏
        await chrome.sidePanel.open({ windowId: tab.windowId })
        
        // 关闭popup
        window.close()
      } catch (error) {
        console.error('Failed to open sidebar:', error)
        this.$emit('error', '打开侧边栏失败，请重试')
      } finally {
        this.isLoading = false
      }
    },
    
    async quickAction(action) {
      try {
        // 先打开侧边栏
        await this.openSidebar()
        
        // 发送消息到侧边栏指定要打开的页面
        chrome.runtime.sendMessage({
          type: 'NAVIGATE_TO',
          page: action
        })
      } catch (error) {
        console.error('Quick action failed:', error)
        this.$emit('error', '操作失败，请重试')
      }
    }
  }
}
</script>

<style scoped>
.popup-container {
  width: 300px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.popup-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
}

.popup-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.popup-content {
  margin-bottom: 20px;
}

.description {
  margin: 0 0 20px 0;
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.4;
}

.open-sidebar-btn {
  width: 100%;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.open-sidebar-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.open-sidebar-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.quick-actions {
  display: flex;
  gap: 8px;
}

.quick-btn {
  flex: 1;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.quick-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.popup-footer {
  text-align: center;
  opacity: 0.7;
}

.popup-footer small {
  font-size: 12px;
}

i {
  font-size: 14px;
}
</style>