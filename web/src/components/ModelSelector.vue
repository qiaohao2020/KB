<template>
  <FloatingDropdown :width="360" class="model-selector">
    <template #trigger="{ toggle, isOpen }">
      <button 
        class="selector-btn"
        @click="toggle"
        :class="{ active: isOpen }"
        title="选择AI模型"
      >
        <i class="bi bi-robot"></i>
        <span class="label">{{ selectedModel?.name || '选择模型' }}</span>
        <i class="bi bi-chevron-down arrow" :class="{ rotate: isOpen }"></i>
      </button>
    </template>
    
    <template #dropdown="{ close }">
      <div class="dropdown-header">
        <span>AI 模型</span>
      </div>
      
      <div class="dropdown-list">
        <div 
          v-for="model in models" 
          :key="model.id"
          class="dropdown-item"
          :class="{ active: selectedModel?.id === model.id }"
          @click="selectModel(model, close)"
        >
          <div class="item-icon">
            <i class="bi bi-robot"></i>
          </div>
          <div class="item-content">
            <div class="item-name">{{ model.name }}</div>
            <div class="item-desc">{{ model.description }}</div>
          </div>
          <div class="item-status" :class="model.status">
            <i class="bi" :class="getStatusIcon(model.status)"></i>
            {{ model.statusText }}
          </div>
        </div>
        
        <div v-if="models.length === 0" class="empty-state">
          <i class="bi bi-inbox"></i>
          <p>暂无可用模型</p>
        </div>
      </div>
    </template>
  </FloatingDropdown>
</template>

<script>
import FloatingDropdown from './FloatingDropdown.vue'

export default {
  name: 'ModelSelector',
  components: {
    FloatingDropdown
  },
  props: {
    models: {
      type: Array,
      default: () => []
    },
    selectedModel: {
      type: Object,
      default: null
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const selectModel = (model, close) => {
      emit('select', model)
      close()
    }

    const getStatusIcon = (status) => {
      const icons = {
        available: 'bi-check-circle-fill',
        limited: 'bi-exclamation-circle-fill',
        unavailable: 'bi-x-circle-fill'
      }
      return icons[status] || 'bi-circle-fill'
    }

    return {
      selectModel,
      getStatusIcon
    }
  }
}
</script>

<style scoped>
.model-selector {
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
  max-width: 180px;
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
  flex-shrink: 0;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
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

.dropdown-list {
  max-height: 320px;
  overflow-y: auto;
  padding: 8px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
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

.item-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(74, 108, 247, 0.1), rgba(102, 126, 234, 0.15));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a6cf7;
  font-size: 18px;
}

.dropdown-item.active .item-icon {
  background: linear-gradient(135deg, #4a6cf7, #667eea);
  color: white;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 13px;
  margin-bottom: 2px;
}

.item-desc {
  color: #718096;
  font-size: 11px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-status {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
}

.item-status i {
  font-size: 10px;
}

.item-status.available {
  background: rgba(56, 161, 105, 0.1);
  color: #38a169;
}

.item-status.limited {
  background: rgba(237, 137, 54, 0.1);
  color: #ed8936;
}

.item-status.unavailable {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
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
