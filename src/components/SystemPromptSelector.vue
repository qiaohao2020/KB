<template>
  <div class="system-prompt-selector">
    <button 
      class="selector-btn"
      @click="toggleDropdown"
      :class="{ active: showDropdown }"
      title="选择系统提示词"
    >
      <i class="bi bi-robot"></i>
      <span class="selector-text">{{ selectedPrompt?.name || '系统提示' }}</span>
      <i class="bi bi-chevron-down selector-arrow"></i>
    </button>
    
    <!-- 系统提示词下拉菜单 -->
    <div class="selector-dropdown" v-if="showDropdown">
      <div class="selector-menu-header">
        <span>系统提示词</span>
        <button 
          class="menu-action-btn" 
          @click.stop="handleAdd"
          title="添加系统提示词"
        >
          <i class="bi bi-plus-circle"></i>
        </button>
      </div>
      
      <div class="selector-menu-list">
        <div 
          class="selector-menu-item"
          :class="{ selected: !selectedPrompt }"
          @click="handleSelect(null)"
        >
          <div class="selector-item-content">
            <div class="selector-item-name">默认</div>
            <div class="selector-item-desc">无系统提示词</div>
          </div>
        </div>
        
        <div 
          v-for="prompt in prompts" 
          :key="prompt.id"
          class="selector-menu-item"
          :class="{ selected: selectedPrompt?.id === prompt.id }"
          @click="handleSelect(prompt)"
        >
          <div class="selector-item-content">
            <div class="selector-item-name">{{ prompt.name }}</div>
            <div class="selector-item-desc">{{ prompt.description || prompt.content.substring(0, 30) + '...' }}</div>
          </div>
          <div class="selector-item-actions">
            <button 
              class="menu-item-btn" 
              @click.stop="handleEdit(prompt)"
              title="编辑"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button 
              class="menu-item-btn delete" 
              @click.stop="handleDelete(prompt.id)"
              title="删除"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'SystemPromptSelector',
  props: {
    prompts: {
      type: Array,
      default: () => []
    },
    selectedPrompt: {
      type: Object,
      default: null
    }
  },
  emits: ['select', 'add', 'edit', 'delete'],
  setup(props, { emit }) {
    const showDropdown = ref(false)

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }

    const handleSelect = (prompt) => {
      emit('select', prompt)
      showDropdown.value = false
    }

    const handleAdd = () => {
      emit('add')
      showDropdown.value = false
    }

    const handleEdit = (prompt) => {
      emit('edit', prompt)
    }

    const handleDelete = (id) => {
      emit('delete', id)
    }

    // 点击外部关闭下拉菜单
    const handleClickOutside = (event) => {
      if (showDropdown.value && !event.target.closest('.system-prompt-selector')) {
        showDropdown.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      showDropdown,
      toggleDropdown,
      handleSelect,
      handleAdd,
      handleEdit,
      handleDelete
    }
  }
}
</script>

<style scoped>
.system-prompt-selector {
  position: relative;
}

.selector-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(74, 108, 247, 0.1);
  border: 1px solid rgba(74, 108, 247, 0.2);
  border-radius: 8px;
  color: #4a6cf7;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  min-width: 120px;
  max-width: 160px;
}

.selector-btn:hover {
  background: rgba(74, 108, 247, 0.15);
  border-color: rgba(74, 108, 247, 0.3);
}

.selector-btn.active {
  background: rgba(74, 108, 247, 0.2);
  border-color: rgba(74, 108, 247, 0.4);
}

.selector-text {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.selector-arrow {
  font-size: 10px;
  transition: transform 0.2s ease;
}

.selector-btn.active .selector-arrow {
  transform: rotate(180deg);
}

.selector-dropdown {
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 8px;
  width: 280px;
  max-height: 300px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(74, 108, 247, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownSlideUp 0.2s ease-out;
}

@keyframes dropdownSlideUp {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.selector-menu-header {
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

.selector-menu-list {
  max-height: 240px;
  overflow-y: auto;
  padding: 8px;
}

.selector-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.selector-menu-item:hover {
  background: rgba(74, 108, 247, 0.1);
}

.selector-menu-item.selected {
  background: rgba(74, 108, 247, 0.15);
  border: 1px solid rgba(74, 108, 247, 0.3);
}

.selector-item-content {
  flex: 1;
  min-width: 0;
}

.selector-item-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 12px;
  margin-bottom: 2px;
}

.selector-item-desc {
  color: #718096;
  font-size: 10px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selector-item-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.selector-menu-item:hover .selector-item-actions {
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

.selector-menu-list::-webkit-scrollbar {
  width: 4px;
}

.selector-menu-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.selector-menu-list::-webkit-scrollbar-thumb {
  background: rgba(74, 108, 247, 0.3);
  border-radius: 2px;
}

.selector-menu-list::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 108, 247, 0.5);
}

@media (max-width: 768px) {
  .selector-btn {
    padding: 4px 8px;
    font-size: 11px;
    min-width: 80px;
    max-width: 100px;
  }
  
  .selector-text {
    font-size: 10px;
  }
  
  .selector-dropdown {
    width: 240px;
  }
}
</style>
