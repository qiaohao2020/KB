<template>
  <div class="chat-container">


    <!-- 聊天消息区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <Message 
        v-for="(message, index) in messages" 
        :key="index" 
        :message="message"
      />
      <div v-if="isLoading" class="loading-indicator">
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="loading-text">AI正在思考中...</span>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <MessageInput 
      :is-loading="isLoading"
      :prompts="prompts"
      :show-prompts="showPrompts"
      :system-prompts="systemPrompts"
      :available-models="availableModels"
      :selected-system-prompt="selectedSystemPrompt"
      :selected-model="selectedModel"
      @send-message="handleSendMessage"
      @toggle-prompts="togglePrompts"
      @use-prompt="usePrompt"
      @show-add-prompt="showAddPromptDialog"
      @edit-prompt="editPrompt"
      @delete-prompt="deletePrompt"
      @select-system-prompt="selectSystemPrompt"
      @select-model="selectModel"
    />
    
    <!-- 添加/编辑Prompt对话框 -->
    <PromptDialog 
      :visible="showDialog"
      :editing-prompt="editingPrompt"
      @close="closeDialog"
      @save="savePrompt"
    />
  </div>
</template>

<script>
import { ref, nextTick, onMounted } from 'vue'
import Message from './Message.vue'
import MessageInput from './MessageInput.vue'
import PromptDialog from './PromptDialog.vue'

export default {
  name: 'ChatContainer',
  components: {
    Message,
    MessageInput,
    PromptDialog
  },
  setup() {
    const messages = ref([])
    const messagesContainer = ref(null)
    const isLoading = ref(false)
    
    // Prompt相关状态
    const showPrompts = ref(true)
    const showDialog = ref(false)
    const editingPrompt = ref(null)
    
    // 系统提示词状态
    const systemPrompts = ref([
      {
        id: 1,
        name: '代码助手',
        description: '专业的代码编写和调试助手',
        content: '你是一个专业的代码助手，帮助用户编写、调试和优化代码。'
      },
      {
        id: 2,
        name: '写作助手',
        description: '创意写作和文案编写助手',
        content: '你是一个专业的写作助手，帮助用户进行创意写作和文案编写。'
      }
    ])
    const selectedSystemPrompt = ref(null)
    
    // 模型选择状态
    const availableModels = ref([
      { id: 'gpt-4', name: 'GPT-4', description: '最新的GPT-4模型，性能强大', status: 'available', statusText: '可用' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '快速响应，成本较低', status: 'available', statusText: '可用' },
      { id: 'claude-3', name: 'Claude-3', description: 'Anthropic的Claude-3模型', status: 'limited', statusText: '受限' }
    ])
    const selectedModel = ref(availableModels.value[0])
    
    // 预设Prompts
    const prompts = ref([
      {
        id: 1,
        name: '代码解释',
        content: '请帮我解释这段代码的功能和工作原理，并指出可能的改进点。',
        isDefault: true
      },
      {
        id: 2,
        name: '文档总结',
        content: '请帮我总结这份文档的主要内容，提取关键信息和要点。',
        isDefault: true
      },
      {
        id: 3,
        name: '问题分析',
        content: '请帮我分析这个问题，提供解决方案和建议。',
        isDefault: true
      },
      {
        id: 4,
        name: '创意写作',
        content: '请以创意和有趣的方式帮我写作，注重文采和表达效果。',
        isDefault: true
      },
      {
        id: 5,
        name: '学习辅导',
        content: '请以教师的角色帮我学习这个知识点，用简单易懂的方式解释。',
        isDefault: true
      }
    ])

    // 发送消息处理
    const handleSendMessage = async (messageText) => {
      const userMessage = {
        type: 'user',
        sender: '用户',
        text: messageText,
        time: new Date().toLocaleTimeString()
      }

      messages.value.push(userMessage)
      isLoading.value = true

      // 滚动到底部
      await nextTick()
      scrollToBottom()

      try {
        // 模拟AI回复
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const aiMessage = {
          type: 'ai',
          sender: 'AI助手',
          text: generateAIResponse(messageText),
          time: new Date().toLocaleTimeString()
        }

        messages.value.push(aiMessage)
      } catch (error) {
        console.error('发送消息失败:', error)
        
        const errorMessage = {
          type: 'ai',
          sender: 'AI助手',
          text: '抱歉，我现在无法回复您的消息。请稍后再试。',
          time: new Date().toLocaleTimeString()
        }
        
        messages.value.push(errorMessage)
      } finally {
        isLoading.value = false
        await nextTick()
        scrollToBottom()
      }
    }

    // 生成AI回复（模拟）
    const generateAIResponse = (userMessage) => {
      const responses = [
        '这是一个很有趣的问题。让我来为您详细解答...',
        '根据您的问题，我建议您可以从以下几个方面来考虑...',
        '感谢您的提问。基于我的理解，这个问题涉及到...',
        '这确实是一个值得深入探讨的话题。从我的角度来看...',
        '您提出了一个很好的观点。让我来分析一下相关的因素...'
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      return `${randomResponse}\n\n您的问题："${userMessage}"\n\n实际应用中，这里应该调用真实的AI接口来获取智能回复。`
    }

    // 滚动到底部
    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }

    // Prompt管理功能
    const togglePrompts = () => {
      showPrompts.value = !showPrompts.value
      // 保存状态到localStorage
      localStorage.setItem('quicksearch-show-prompts', showPrompts.value.toString())
    }

    const usePrompt = (prompt) => {
      // 触发发送消息
      handleSendMessage(prompt.content)
      // 收起prompt区域
      showPrompts.value = false
    }

    const showAddPromptDialog = () => {
      editingPrompt.value = null
      showDialog.value = true
    }

    const editPrompt = (prompt) => {
      editingPrompt.value = prompt
      showDialog.value = true
    }

    const closeDialog = () => {
      showDialog.value = false
      editingPrompt.value = null
    }

    const savePrompt = (promptData) => {
      if (editingPrompt.value) {
        // 编辑现有prompt
        const index = prompts.value.findIndex(p => p.id === editingPrompt.value.id)
        if (index !== -1) {
          prompts.value[index] = {
            ...prompts.value[index],
            name: promptData.name,
            content: promptData.content
          }
        }
      } else {
        // 添加新prompt
        const newPrompt = {
          id: Date.now(),
          name: promptData.name,
          content: promptData.content,
          isDefault: false
        }
        prompts.value.push(newPrompt)
      }

      // 保存到localStorage
      savePromptsToStorage()
      closeDialog()
    }

    const deletePrompt = (promptId) => {
      if (confirm('确定要删除这个Prompt吗？')) {
        prompts.value = prompts.value.filter(p => p.id !== promptId)
        savePromptsToStorage()
      }
    }

    const savePromptsToStorage = () => {
      const customPrompts = prompts.value.filter(p => !p.isDefault)
      localStorage.setItem('quicksearch-custom-prompts', JSON.stringify(customPrompts))
    }

    const loadPromptsFromStorage = () => {
      try {
        const customPrompts = JSON.parse(localStorage.getItem('quicksearch-custom-prompts') || '[]')
        prompts.value = [...prompts.value, ...customPrompts]
      } catch (error) {
        console.error('加载自定义Prompts失败:', error)
      }
    }

    // 初始化
    onMounted(() => {
      // 加载自定义prompts
      loadPromptsFromStorage()
      
      // 恢复显示状态
      const savedShowPrompts = localStorage.getItem('quicksearch-show-prompts')
      if (savedShowPrompts !== null) {
        showPrompts.value = savedShowPrompts === 'true'
      }
      
      // 初始化欢迎消息
      const welcomeMessage = {
        type: 'ai',
        sender: 'AI助手',
        text: '您好！我是您的AI助手，有什么可以帮助您的吗？您可以使用上方的快速开始功能来选择预设的对话模式。',
        time: new Date().toLocaleTimeString()
      }
      messages.value.push(welcomeMessage)
    })

    return {
      messages,
      messagesContainer,
      isLoading,
      showPrompts,
      showDialog,
      editingPrompt,
      prompts,
      systemPrompts,
      selectedSystemPrompt,
      availableModels,
      selectedModel,
      handleSendMessage,
      togglePrompts,
      usePrompt,
      showAddPromptDialog,
      editPrompt,
      closeDialog,
      savePrompt,
      deletePrompt,
      selectSystemPrompt: (prompt) => {
        selectedSystemPrompt.value = prompt
      },
      selectModel: (model) => {
        selectedModel.value = model
      }
    }
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  /* 移除边框、圆角和阴影，让容器占满整个空间 */
  overflow: hidden;
}

/* 预设Prompt区域 */
.prompt-section {
  background: rgba(74, 108, 247, 0.05);
  border-bottom: 1px solid rgba(74, 108, 247, 0.1);
  padding: 16px 20px;
}

.prompt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.prompt-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a6cf7;
  font-weight: 600;
  font-size: 14px;
}

.prompt-title i {
  font-size: 16px;
}

.prompt-actions {
  display: flex;
  gap: 8px;
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
  transition: all 0.2s ease;
  font-size: 12px;
}

.action-btn:hover {
  background: rgba(74, 108, 247, 0.2);
  transform: scale(1.05);
}

.prompt-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.prompt-item {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(74, 108, 247, 0.2);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.prompt-item:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: #4a6cf7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.15);
}

.prompt-content {
  flex: 1;
  min-width: 0;
}

.prompt-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 13px;
  margin-bottom: 4px;
}

.prompt-preview {
  color: #718096;
  font-size: 11px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.prompt-item-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.prompt-item:hover .prompt-item-actions {
  opacity: 1;
}

.item-action-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: rgba(74, 108, 247, 0.1);
  color: #4a6cf7;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  transition: all 0.2s ease;
}

.item-action-btn:hover {
  background: rgba(74, 108, 247, 0.2);
}

.item-action-btn.delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.item-action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* 收起状态的Prompt按钮 */
.prompt-toggle {
  padding: 8px 20px;
  border-bottom: 1px solid rgba(74, 108, 247, 0.1);
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(74, 108, 247, 0.1);
  border: 1px solid rgba(74, 108, 247, 0.2);
  border-radius: 8px;
  color: #4a6cf7;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: rgba(74, 108, 247, 0.2);
  transform: translateY(-1px);
}

/* 聊天消息区域 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  scroll-behavior: smooth;
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(247, 250, 252, 0.8) 100%);
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  max-width: 80%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(74, 108, 247, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(74, 108, 247, 0.1);
  backdrop-filter: blur(10px);
}

.loading-dots {
  display: flex;
  gap: 6px;
}

.loading-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4a6cf7, #667eea);
  animation: loading-bounce 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }
.loading-dots span:nth-child(3) { animation-delay: 0s; }

.loading-text {
  color: #4a6cf7;
  font-size: 14px;
  font-weight: 500;
}

@keyframes loading-bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* 对话框样式已移动到独立的PromptDialog组件 */

/* 自定义滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #4a6cf7, #667eea);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #3a5ce4, #5a6fd8);
  transform: scale(1.1);
}

/* 滚动条在Firefox中的样式 */
.chat-messages {
  scrollbar-width: thin;
  scrollbar-color: #4a6cf7 rgba(255, 255, 255, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .prompt-section {
    padding: 12px 16px;
  }
  
  .prompt-list {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .prompt-item {
    padding: 10px;
  }
  
  .prompt-name {
    font-size: 12px;
  }
  
  .prompt-preview {
    font-size: 10px;
  }
}
</style>