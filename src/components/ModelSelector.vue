<template>
  <div class="model-selector">
    <button 
      class="selector-btn"
      @click="toggleDropdown"
      :class="{ active: showDropdown }"
      title="选择模型"
    >
      <i class="bi bi-cpu"></i>
      <span class="selector-text">{{ selectedModel?.name || 'GPT-4' }}</span>
      <i class="bi bi-chevron-down selector-arrow"></i>
    </button>
    
    <!-- 模型下拉菜单 -->
    <div class="selector-dropdown" v-if="showDropdown">
      <div class="selector-menu-header">
        <span>选择模型</span>
      </div>
      
      <div class="selector-menu-list">
        <div 
          v-for="model in models" 
          :key="model.id"
          class="selector-menu-item"
          :class="{ selected: selectedModel?.id === model.id }"
          @click="handleSelect(model)"
        >
          <div class="selector-item-content">
            <div class="selector-item-name">{{ model.name }}</div>
            <div class="selector-item-desc">{{ model.description }}</div>
          </div>
          <div class="model-status" v-if="model.status">
            <span class="status-badge" :class="model.status">{{ model.statusText }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ModelSelector',
  props: {
    models: {
      type: Array,
      default: () => [
        { id: 'gpt-4', name: 'GPT-4', description: '最新的GPT-4模型，性能强大', status: 'available', statusText: '可用' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '快速响应，成本较低', status: 'available', statusText: '可用' },
        { id: 'claude-3', name: 'Claude-3', description: 'Anthropic的Claude-3模型', status: 'limited', statusText: '受限' }
      ]
    },
    selectedModel: {
      type: Object,
      default: null
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const showDropdown = ref(false)

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }

    const handleSelect = (model) => {
      emit('select', model)
      showDropdown.value = false
    }

    // 点击外部关闭下拉菜单
    const handleClickOutside = (event) => {
      if (showDropdown.value && !event.target.closest('.model-selector')) {
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
      handleSelect
    }
  }
}
</script>

<style scoped>
.model-selector {
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

.model-status {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.status-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.available {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-badge.limited {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
}

.status-badge.unavailable {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
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
