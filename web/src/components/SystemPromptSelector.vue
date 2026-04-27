<template>
  <FloatingDropdown :width="320" class="system-prompt-selector">
    <template #trigger="{ toggle, isOpen }">
      <button 
        class="selector-btn"
        @click="toggle"
        :class="{ active: isOpen }"
        title="选择系统提示词"
      >
        <i class="bi bi-cpu"></i>
        <span class="label">{{ selectedPrompt?.name || '系统提示' }}</span>
        <i class="bi bi-chevron-down arrow" :class="{ rotate: isOpen }"></i>
      </button>
    </template>
    
    <template #dropdown="{ close }">
      <div class="dropdown-header">
        <span>系统提示词</span>
        <button class="add-btn" @click="$emit('add'); close()" title="添加新的系统提示词">
          <i class="bi bi-plus-circle"></i>
        </button>
      </div>
      
      <div class="dropdown-list">
        <div 
          v-for="prompt in prompts" 
          :key="prompt.id"
          class="dropdown-item"
          :class="{ active: selectedPrompt?.id === prompt.id }"
          @click="selectPrompt(prompt, close)"
        >
          <div class="item-content">
            <div class="item-name">{{ prompt.name }}</div>
            <div class="item-desc">{{ prompt.description }}</div>
          </div>
          <div class="item-actions">
            <button 
              class="action-btn" 
              @click.stop="$emit('edit', prompt)"
              title="编辑"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button 
              class="action-btn delete" 
              @click.stop="$emit('delete', prompt.id)"
              title="删除"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        
        <div v-if="prompts.length === 0" class="empty-state">
          <i class="bi bi-inbox"></i>
          <p>暂无系统提示词</p>
        </div>
      </div>
    </template>
  </FloatingDropdown>
</template>

<script>
import FloatingDropdown from './FloatingDropdown.vue'

export default {
  name: 'SystemPromptSelector',
  components: {
    FloatingDropdown
  },
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
    const selectPrompt = (prompt, close) => {
      emit('select', prompt)
      close()
    }

    return {
      selectPrompt
    }
  }
}
</script>

<style scoped>
.system-prompt-selector {
  display: inline-block;
}

.selector-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(74, 108, 247, 0.1);
  border: 1px solid rgba(74, 108, 247, 0.2);
  border-radius: 8px;
  color: #4a6cf7;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.selector-btn:hover {
  background: rgba(74, 108, 247, 0.2);
}

.selector-btn.active {
  background: rgba(74, 108, 247, 0.3);
  color: #3a5ce4;
}

.selector-btn i {
  font-size: 13px;
}

.arrow {
  font-size: 10px;
  transition: transform 0.2s ease;
  margin-left: auto;
}

.arrow.rotate {
  transform: rotate(180deg);
}

.label {
  display: none;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 768px) {
  .label {
    display: inline;
  }
}

.dropdown-header {
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

.add-btn {
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

.add-btn:hover {
  background: rgba(74, 108, 247, 0.2);
  transform: scale(1.05);
}

.dropdown-list {
  max-height: 320px;
  overflow-y: auto;
  padding: 8px;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.dropdown-item:hover {
  background: rgba(74, 108, 247, 0.1);
}

.dropdown-item.active {
  background: rgba(74, 108, 247, 0.2);
  border-left: 3px solid #4a6cf7;
  padding-left: 9px;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 12px;
  margin-bottom: 2px;
}

.item-desc {
  color: #718096;
  font-size: 10px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
  margin-left: 8px;
}

.dropdown-item:hover .item-actions {
  opacity: 1;
}

.action-btn {
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

.action-btn:hover {
  background: rgba(74, 108, 247, 0.2);
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
  color: #a0aec0;
}

.empty-state i {
  font-size: 32px;
  margin-bottom: 8px;
  display: block;
}

.empty-state p {
  font-size: 12px;
  margin: 0;
}

.dropdown-list::-webkit-scrollbar {
  width: 4px;
}

.dropdown-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.dropdown-list::-webkit-scrollbar-thumb {
  background: rgba(74, 108, 247, 0.3);
  border-radius: 2px;
}

.dropdown-list::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 108, 247, 0.5);
}
</style>
