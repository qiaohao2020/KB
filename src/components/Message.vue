<template>
  <div :class="['message', message.type]">
    <div class="message-avatar">
      <div class="avatar-icon">
        <i :class="message.type === 'user' ? 'bi bi-person-fill' : 'bi bi-robot'"></i>
      </div>
    </div>
    
    <div class="message-content">
      <div class="message-header">
        <span class="message-sender">{{ message.sender }}</span>
        <span class="message-time">{{ message.time }}</span>
      </div>
      <div class="message-text" v-html="formatMessage(message.text)"></div>
      
      <div class="message-actions" v-if="message.type === 'ai'">
        <button class="action-btn" @click="copyMessage" title="复制消息">
          <i class="bi bi-clipboard"></i>
        </button>
        <button class="action-btn" @click="likeMessage" title="点赞">
          <i class="bi bi-hand-thumbs-up"></i>
        </button>
        <button class="action-btn" @click="regenerateMessage" title="重新生成">
          <i class="bi bi-arrow-clockwise"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Message',
  props: {
    message: {
      type: Object,
      required: true,
      validator(value) {
        return value && 
               typeof value.type === 'string' && 
               typeof value.sender === 'string' && 
               typeof value.text === 'string' && 
               typeof value.time === 'string';
      }
    }
  },
  methods: {
    formatMessage(text) {
      // 简单的文本格式化，支持换行
      return text.replace(/\n/g, '<br>')
    },
    
    copyMessage() {
      navigator.clipboard.writeText(this.message.text).then(() => {
        // 可以添加复制成功的提示
        console.log('消息已复制到剪贴板')
      }).catch(err => {
        console.error('复制失败:', err)
      })
    },
    
    likeMessage() {
      // 点赞功能
      console.log('点赞消息:', this.message.text)
    },
    
    regenerateMessage() {
      // 重新生成消息
      this.$emit('regenerate', this.message)
    }
  }
}
</script>

<style scoped>
.message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  max-width: 85%;
  animation: messageSlideIn 0.3s ease-out;
}

.message.user {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message.ai {
  margin-right: auto;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 头像区域 */
.message-avatar {
  flex-shrink: 0;
}

.avatar-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.message.user .avatar-icon {
  background: linear-gradient(45deg, #4a6cf7, #667eea);
}

.message.ai .avatar-icon {
  background: linear-gradient(45deg, #38a169, #48bb78);
}

/* 消息内容 */
.message-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  transition: all 0.3s ease;
}

.message.user .message-content {
  background: linear-gradient(135deg, rgba(74, 108, 247, 0.1), rgba(102, 126, 234, 0.05));
  border-color: rgba(74, 108, 247, 0.2);
}

.message.ai .message-content {
  background: linear-gradient(135deg, rgba(56, 161, 105, 0.1), rgba(72, 187, 120, 0.05));
  border-color: rgba(56, 161, 105, 0.2);
}

.message-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* 消息气泡尾巴 */
.message-content::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border: 8px solid transparent;
}

.message.user .message-content::before {
  right: -15px;
  top: 20px;
  border-left-color: rgba(255, 255, 255, 0.95);
}

.message.ai .message-content::before {
  left: -15px;
  top: 20px;
  border-right-color: rgba(255, 255, 255, 0.95);
}

/* 消息头部 */
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.message-sender {
  font-weight: 600;
  color: #4a6cf7;
}

.message.ai .message-sender {
  color: #38a169;
}

.message-time {
  color: #a0aec0;
  font-size: 11px;
}

/* 消息文本 */
.message-text {
  line-height: 1.6;
  color: #2d3748;
  font-size: 14px;
  word-wrap: break-word;
}

.message-text :deep(br) {
  margin: 4px 0;
}

/* 消息操作按钮 */
.message-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(160, 174, 192, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.message-content:hover .message-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(74, 108, 247, 0.1);
  color: #4a6cf7;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(74, 108, 247, 0.2);
  transform: scale(1.1);
}

.message.ai .action-btn {
  background: rgba(56, 161, 105, 0.1);
  color: #38a169;
}

.message.ai .action-btn:hover {
  background: rgba(56, 161, 105, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message {
    max-width: 95%;
    gap: 8px;
    margin-bottom: 20px;
  }
  
  .avatar-icon {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  .message-content {
    padding: 12px 16px;
    border-radius: 12px;
  }
  
  .message-text {
    font-size: 13px;
  }
  
  .message-actions {
    gap: 6px;
    margin-top: 8px;
    padding-top: 8px;
  }
  
  .action-btn {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
  
  /* 移动端始终显示操作按钮 */
  .message-actions {
    opacity: 1;
  }
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
  .message-content {
    background: rgba(45, 55, 72, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .message-text {
    color: #e2e8f0;
  }
  
  .message-time {
    color: #718096;
  }
}
</style>