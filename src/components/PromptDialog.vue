<template>
  <div class="prompt-dialog-overlay" v-if="visible" @click="handleOverlayClick">
    <div class="prompt-dialog" @click.stop>
      <div class="dialog-header">
        <h3>{{ editingPrompt ? '编辑' : '添加' }}自定义Prompt</h3>
        <button class="close-btn" @click="handleClose">
          <i class="bi bi-x"></i>
        </button>
      </div>
      
      <div class="dialog-content">
        <div class="form-group">
          <label>名称</label>
          <input 
            type="text" 
            v-model="formData.name" 
            placeholder="输入Prompt名称"
            class="form-input"
            @keydown.enter="handleSave"
          >
        </div>
        
        <div class="form-group">
          <label>内容</label>
          <textarea 
            v-model="formData.content" 
            placeholder="输入Prompt内容..."
            class="form-textarea"
            rows="4"
            @keydown.ctrl.enter="handleSave"
          ></textarea>
        </div>
      </div>
      
      <div class="dialog-actions">
        <button class="btn btn-secondary" @click="handleClose">取消</button>
        <button 
          class="btn btn-primary" 
          @click="handleSave"
          :disabled="!isFormValid"
        >
          {{ editingPrompt ? '保存' : '添加' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'PromptDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editingPrompt: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const formData = ref({
      name: '',
      content: ''
    })

    // 计算表单是否有效
    const isFormValid = computed(() => {
      return formData.value.name.trim() && formData.value.content.trim()
    })

    // 监听编辑的Prompt变化，更新表单数据
    watch(() => props.editingPrompt, (newPrompt) => {
      if (newPrompt) {
        formData.value = {
          name: newPrompt.name,
          content: newPrompt.content
        }
      } else {
        formData.value = {
          name: '',
          content: ''
        }
      }
    }, { immediate: true })

    // 监听对话框显示状态，重置表单
    watch(() => props.visible, (visible) => {
      if (visible && !props.editingPrompt) {
        formData.value = {
          name: '',
          content: ''
        }
      }
    })

    const handleClose = () => {
      emit('close')
    }

    const handleOverlayClick = () => {
      handleClose()
    }

    const handleSave = () => {
      if (!isFormValid.value) return

      const promptData = {
        name: formData.value.name.trim(),
        content: formData.value.content.trim()
      }

      emit('save', promptData)
    }

    return {
      formData,
      isFormValid,
      handleClose,
      handleOverlayClick,
      handleSave
    }
  }
}
</script>

<style scoped>
/* 对话框样式 */
.prompt-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: overlayFadeIn 0.2s ease-out;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.prompt-dialog {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  animation: dialogSlideIn 0.3s ease-out;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.dialog-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(160, 174, 192, 0.1);
  color: #a0aec0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(160, 174, 192, 0.2);
  color: #718096;
  transform: scale(1.05);
}

.dialog-content {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2d3748;
  font-weight: 500;
  font-size: 14px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
  background: white;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.form-input:hover,
.form-textarea:hover {
  border-color: #cbd5e0;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
  font-family: inherit;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 80px;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(45deg, #4a6cf7, #667eea);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(45deg, #3a5ce4, #5a6fd8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.3);
}

.btn-primary:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .prompt-dialog {
    width: 95%;
    margin: 20px;
    max-height: 90vh;
  }
  
  .dialog-header,
  .dialog-content,
  .dialog-actions {
    padding: 16px 20px;
  }
  
  .dialog-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    min-width: auto;
  }
  
  .form-input,
  .form-textarea {
    font-size: 16px; /* 防止iOS缩放 */
  }
}

/* 键盘导航支持 */
.btn:focus {
  outline: 2px solid #4a6cf7;
  outline-offset: 2px;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
}

/* 暗色模式支持（可选） */
@media (prefers-color-scheme: dark) {
  .prompt-dialog {
    background: #1a202c;
    color: #e2e8f0;
  }
  
  .dialog-header {
    background: #2d3748;
    border-bottom-color: #4a5568;
  }
  
  .dialog-header h3 {
    color: #e2e8f0;
  }
  
  .dialog-actions {
    background: #2d3748;
    border-top-color: #4a5568;
  }
  
  .form-input,
  .form-textarea {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .form-input:focus,
  .form-textarea:focus {
    border-color: #4a6cf7;
  }
  
  .form-group label {
    color: #e2e8f0;
  }
}
</style>