<template>
  <div class="chat-input-container">
    <!-- 拖拽调整高度的手柄 -->
    <div 
      class="resize-handle"
      @mousedown="startResize"
      @touchstart="startResize"
    >
      <div class="resize-indicator">
        <i class="bi bi-grip-horizontal"></i>
      </div>
    </div>
    
    <!-- 操作按钮区域 - 移动到输入区域上方 -->
    <div class="top-actions">
      <div class="action-buttons">
        <button 
          class="action-btn"
          @click="clearInput"
          :disabled="!inputMessage.trim() || isLoading"
          title="清空输入"
        >
          <i class="bi bi-x-circle"></i>
        </button>
        
        <button 
          class="action-btn toggle-mode-btn"
          @click.stop="toggleInputMode"
          title="切换输入模式"
        >
          <i :class="isMultiLine ? 'bi bi-arrows-collapse' : 'bi bi-arrows-fullscreen'"></i>
        </button>
        
        <!-- 快速开始按钮 -->
        <div class="prompt-dropdown" v-if="prompts && prompts.length > 0">
          <button 
            class="action-btn prompt-btn"
            @click="togglePromptDropdown"
            title="快速开始"
            :class="{ active: showPromptDropdown }"
          >
            <i class="bi bi-lightbulb"></i>
          </button>
          
          <!-- 下拉菜单 -->
          <div class="prompt-dropdown-menu" v-if="showPromptDropdown">
            <div class="prompt-menu-header">
              <span>快速开始</span>
              <button 
                class="menu-action-btn" 
                @click="$emit('show-add-prompt')"
                title="添加自定义Prompt"
              >
                <i class="bi bi-plus-circle"></i>
              </button>
            </div>
            
            <div class="prompt-menu-list">
              <div 
                v-for="prompt in prompts" 
                :key="prompt.id"
                class="prompt-menu-item"
                @click="usePrompt(prompt)"
              >
                <div class="prompt-menu-content">
                  <div class="prompt-menu-name">{{ prompt.name }}</div>
                  <div class="prompt-menu-preview">{{ prompt.content.substring(0, 30) }}...</div>
                </div>
                <div class="prompt-menu-actions">
                  <button 
                    class="menu-item-btn" 
                    @click.stop="$emit('edit-prompt', prompt)"
                    title="编辑"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    class="menu-item-btn delete" 
                    @click.stop="$emit('delete-prompt', prompt.id)"
                    title="删除"
                    v-if="!prompt.isDefault"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-tips">
        <span class="tip">Ctrl+Enter 发送</span>
        <span class="separator">•</span>
        <span class="tip">拖拽上方调整高度</span>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="chat-input" :style="{ height: inputHeight + 'px' }">
      <div class="input-wrapper">
        <textarea 
          v-model="inputMessage" 
          placeholder="输入您的问题，按 Ctrl+Enter 发送..."
          @keydown="handleKeydown"
          :disabled="isLoading"
          ref="textareaRef"
          class="message-textarea"
        ></textarea>
        
        <!-- 底部发送区域 -->
        <div class="send-area">
          <div class="left-controls">
            <!-- 系统提示词选择 -->
            <SystemPromptSelector
              :prompts="systemPrompts"
              :selected-prompt="selectedSystemPrompt"
              @select="handleSelectSystemPrompt"
              @add="handleAddSystemPrompt"
              @edit="handleEditSystemPrompt"
              @delete="handleDeleteSystemPrompt"
            />
            
            <!-- 模型选择 -->
            <ModelSelector
              :models="availableModels"
              :selected-model="selectedModel"
              @select="handleSelectModel"
            />
            
            <!-- 字数统计 -->
            <div class="char-count">
              <span :class="{ 'over-limit': inputMessage.length > maxLength }">
                {{ inputMessage.length }}
              </span>
              <span class="separator">/</span>
              <span class="max-length">{{ maxLength }}</span>
            </div>
          </div>
          
          <button 
            class="send-btn" 
            @click="handleSendMessage"
            :disabled="!inputMessage.trim() || isLoading"
          >
            <i class="bi bi-send-fill"></i>
            <span>发送</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import SystemPromptSelector from './SystemPromptSelector.vue'
import ModelSelector from './ModelSelector.vue'

export default {
  name: 'MessageInput',
  components: {
    SystemPromptSelector,
    ModelSelector
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    prompts: {
      type: Array,
      default: () => []
    },
    showPrompts: {
      type: Boolean,
      default: false
    },
    systemPrompts: {
      type: Array,
      default: () => []
    },
    availableModels: {
      type: Array,
      default: () => [
        { id: 'gpt-4', name: 'GPT-4', description: '最新的GPT-4模型，性能强大', status: 'available', statusText: '可用' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '快速响应，成本较低', status: 'available', statusText: '可用' },
        { id: 'claude-3', name: 'Claude-3', description: 'Anthropic的Claude-3模型', status: 'limited', statusText: '受限' }
      ]
    },
    selectedSystemPrompt: {
      type: Object,
      default: null
    },
    selectedModel: {
      type: Object,
      default: null
    }
  },
  emits: [
    'send-message', 
    'toggle-prompts', 
    'use-prompt', 
    'show-add-prompt', 
    'edit-prompt', 
    'delete-prompt',
    'add-system-prompt',
    'edit-system-prompt',
    'delete-system-prompt',
    'select-system-prompt',
    'select-model'
  ],
  setup(props, { emit }) {
    const inputMessage = ref('')
    const textareaRef = ref(null)
    const inputHeight = ref(120) // 默认高度
    const minHeight = 80
    const maxHeight = 300
    const maxLength = 2000
    const isMultiLine = ref(true)
    const isResizing = ref(false)
    const showPromptDropdown = ref(false)
    const savedHeight = ref(120) // 保存多行模式的高度

    // 拖拽调整高度相关
    const startResize = (event) => {
      event.preventDefault()
      isResizing.value = true
      
      const startY = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY
      const startHeight = inputHeight.value

      const handleMouseMove = (e) => {
        if (!isResizing.value) return
        
        const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY
        const deltaY = startY - currentY // 向上拖拽为正值
        const newHeight = Math.min(Math.max(startHeight + deltaY, minHeight), maxHeight)
        
        inputHeight.value = newHeight
      }

      const handleMouseUp = () => {
        isResizing.value = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleMouseMove)
        document.removeEventListener('touchend', handleMouseUp)
        
        // 保存高度到localStorage
        localStorage.setItem('quicksearch-chat-input-height', inputHeight.value.toString())
        
        // 如果当前是多行模式，更新保存的高度
        if (isMultiLine.value) {
          savedHeight.value = inputHeight.value
        }
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleMouseMove)
      document.addEventListener('touchend', handleMouseUp)
    }



    // 处理键盘事件
    const handleKeydown = (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault()
        handleSendMessage()
      } else if (event.key === 'Enter' && !event.shiftKey && !isMultiLine.value) {
        event.preventDefault()
        handleSendMessage()
      }
    }

    // 发送消息
    const handleSendMessage = async () => {
      if (!inputMessage.value.trim() || props.isLoading) return
      if (inputMessage.value.length > maxLength) return

      const message = inputMessage.value.trim()
      inputMessage.value = ''

      emit('send-message', message)
    }

    // 清空输入
    const clearInput = () => {
      inputMessage.value = ''
    }

    // 切换输入模式
    const toggleInputMode = () => {
      isMultiLine.value = !isMultiLine.value
      
      if (!isMultiLine.value) {
        // 切换到单行模式：保存当前高度，然后设置为最小高度
        savedHeight.value = inputHeight.value
        inputHeight.value = minHeight
      } else {
        // 切换到多行模式：恢复之前保存的高度
        inputHeight.value = savedHeight.value
      }
    }

    // Prompt相关方法
    const togglePromptDropdown = () => {
      showPromptDropdown.value = !showPromptDropdown.value
      // 不进行位置检查，悬浮框始终显示在按钮右上方
    }
    
    // 重置下拉菜单位置类（固定显示在右上方）
    const resetDropdownPosition = () => {
      const dropdown = document.querySelector('.prompt-dropdown-menu')
      if (!dropdown) return
      
      // 移除所有位置调整类，确保使用默认的右上方位置
      dropdown.classList.remove('position-left', 'position-bottom')
    }

    const usePrompt = (prompt) => {
      inputMessage.value = prompt.content
      showPromptDropdown.value = false
      
      nextTick(() => {
        if (textareaRef.value) {
          textareaRef.value.focus()
        }
      })
    }

    // 系统提示词相关方法
    const handleSelectSystemPrompt = (prompt) => {
      emit('select-system-prompt', prompt)
    }

    const handleAddSystemPrompt = () => {
      emit('add-system-prompt')
    }

    const handleEditSystemPrompt = (prompt) => {
      emit('edit-system-prompt', prompt)
    }

    const handleDeleteSystemPrompt = (id) => {
      emit('delete-system-prompt', id)
    }

    // 模型选择相关方法
    const handleSelectModel = (model) => {
      emit('select-model', model)
    }

    // 点击外部关闭下拉菜单
    const handleClickOutside = (event) => {
      if (showPromptDropdown.value && !event.target.closest('.prompt-dropdown')) {
        showPromptDropdown.value = false
      }
    }



    // 组件挂载时恢复高度
    onMounted(() => {
      const savedHeightStr = localStorage.getItem('quicksearch-chat-input-height')
      if (savedHeightStr) {
        const height = parseInt(savedHeightStr)
        if (height >= minHeight && height <= maxHeight) {
          inputHeight.value = height
          savedHeight.value = height // 同时更新保存的高度
        }
      }
      
      // 添加全局点击事件监听
      document.addEventListener('click', handleClickOutside)
      
      nextTick(() => {
        if (textareaRef.value) {
          textareaRef.value.focus()
        }
      })
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      inputMessage,
      textareaRef,
      inputHeight,
      maxLength,
      isMultiLine,
      isResizing,
      showPromptDropdown,
      handleSendMessage,
      handleKeydown,
      clearInput,
      toggleInputMode,
      startResize,
      togglePromptDropdown,
      usePrompt,
      resetDropdownPosition,
      handleSelectSystemPrompt,
      handleAddSystemPrompt,
      handleEditSystemPrompt,
      handleDeleteSystemPrompt,
      handleSelectModel
    }
  }
}
</script>

<style scoped>
.chat-input-container {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* 拖拽调整手柄 */
.resize-handle {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 16px;
  cursor: ns-resize;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-indicator {
  width: 40px;
  height: 4px;
  background: rgba(74, 108, 247, 0.3);
  border-radius: 2px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-handle:hover .resize-indicator {
  background: rgba(74, 108, 247, 0.6);
  height: 6px;
}

.resize-indicator i {
  font-size: 12px;
  color: rgba(74, 108, 247, 0.8);
}

/* 输入区域 */
.chat-input {
  padding: 16px 20px;
  transition: height 0.2s ease;
  min-height: 80px;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(74, 108, 247, 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.1);
}

.message-textarea {
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  font-family: inherit;
  line-height: 1.5;
  background: transparent;
  color: #2d3748;
  min-height: 40px;
}

.message-textarea::placeholder {
  color: #a0aec0;
}

.message-textarea:disabled {
  background-color: rgba(247, 250, 252, 0.5);
  cursor: not-allowed;
  color: #a0aec0;
}

/* 顶部操作按钮区域 */
.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  background: rgba(247, 250, 252, 0.8);
  border-bottom: 1px solid rgba(74, 108, 247, 0.1);
}

/* 底部发送区域 */
.send-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: rgba(247, 250, 252, 0.5);
  border-top: 1px solid rgba(74, 108, 247, 0.1);
}

.left-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(74, 108, 247, 0.1);
  color: #4a6cf7;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 14px;
}

.action-btn:hover:not(:disabled) {
  background: rgba(74, 108, 247, 0.2);
  transform: scale(1.05);
}

.action-btn:disabled {
  background: rgba(160, 174, 192, 0.1);
  color: #a0aec0;
  cursor: not-allowed;
  transform: none;
}

.action-btn.prompt-btn.active {
  background: rgba(74, 108, 247, 0.3);
  color: #3a5ce4;
}

.action-btn.toggle-mode-btn {
  position: relative;
  z-index: 10;
}

.action-btn.toggle-mode-btn:active {
  background: rgba(74, 108, 247, 0.3);
  transform: scale(0.95);
}

/* Prompt下拉菜单 */
.prompt-dropdown {
  position: relative;
}

.prompt-dropdown-menu {
  position: absolute;
  top: -350px;
  left: 100%;
  margin-left: 8px;
  width: 320px;
  max-height: 400px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(74, 108, 247, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownSlideRight 0.2s ease-out;
}

/* 悬浮框固定显示在按钮右上方，不进行位置调整 */

@keyframes dropdownSlideRight {
  from {
    opacity: 0;
    transform: translateX(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* 只保留右侧滑入动画，因为悬浮框固定在右上方 */

.prompt-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(74, 108, 247, 0.05);
  border-bottom: 1px solid rgba(74, 108, 247, 0.1);
  color: #4a6cf7;
  font-weight: 600;
  font-size: 13px;
}

.menu-action-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(74, 108, 247, 0.1);
  color: #4a6cf7;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  transition: all 0.2s ease;
}

.menu-action-btn:hover {
  background: rgba(74, 108, 247, 0.2);
  transform: scale(1.05);
}

.prompt-menu-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
}

.prompt-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.prompt-menu-item:hover {
  background: rgba(74, 108, 247, 0.1);
}

.prompt-menu-content {
  flex: 1;
  min-width: 0;
}

.prompt-menu-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 12px;
  margin-bottom: 2px;
}

.prompt-menu-preview {
  color: #718096;
  font-size: 10px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.prompt-menu-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.prompt-menu-item:hover .prompt-menu-actions {
  opacity: 1;
}

.menu-item-btn {
  width: 18px;
  height: 18px;
  border: none;
  background: rgba(74, 108, 247, 0.1);
  color: #4a6cf7;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  transition: all 0.2s ease;
}

.menu-item-btn:hover {
  background: rgba(74, 108, 247, 0.2);
}

.menu-item-btn.delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.menu-item-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* 下拉菜单滚动条 */
.prompt-menu-list::-webkit-scrollbar {
  width: 4px;
}

.prompt-menu-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.prompt-menu-list::-webkit-scrollbar-thumb {
  background: rgba(74, 108, 247, 0.3);
  border-radius: 2px;
}

.prompt-menu-list::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 108, 247, 0.5);
}

.send-btn {
  background: linear-gradient(45deg, #4a6cf7, #667eea);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 8px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.3);
}

.send-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #3a5ce4, #5a6fd8);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 108, 247, 0.4);
}

.send-btn:disabled {
  background: linear-gradient(45deg, #a0aec0, #cbd5e0);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 字数统计样式 */
.char-count {
  display: flex;
  align-items: center;
  gap: 2px;
  color: #718096;
  font-size: 12px;
}

.char-count .over-limit {
  color: #e53e3e;
  font-weight: 600;
}

.separator {
  color: #cbd5e0;
  margin: 0 4px;
}

.max-length {
  color: #a0aec0;
}

/* 输入提示样式 - 现在在顶部 */
.input-tips {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #a0aec0;
  font-size: 11px;
}

.tip {
  font-size: 11px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-input {
    padding: 12px 16px;
  }
  
  .top-actions {
    padding: 6px 16px;
  }
  
  .message-textarea {
    padding: 10px 12px;
  }
  
  .send-area {
    padding: 8px 12px;
  }
  
  .left-controls {
    gap: 8px;
  }
  
  .action-buttons {
    gap: 6px;
  }
  
  .action-btn {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
  
  .send-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .char-count {
    font-size: 11px;
  }
  
  .input-tips {
    display: none; /* 在移动端隐藏提示 */
  }
}

/* 拖拽时的视觉反馈 */
.chat-input-container:has(.resize-handle:active) .input-wrapper {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.2);
}

/* 滚动条样式 */
.message-textarea::-webkit-scrollbar {
  width: 6px;
}

.message-textarea::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.message-textarea::-webkit-scrollbar-thumb {
  background: rgba(74, 108, 247, 0.3);
  border-radius: 3px;
}

.message-textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 108, 247, 0.5);
}
</style>