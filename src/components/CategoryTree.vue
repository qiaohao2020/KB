<template>
  <div class="category-tree" :style="{ width: treeWidth + 'px' }">
    <div class="tree-header">
      <h3>知识分类</h3>
      <div class="tree-actions">
        <button class="btn-icon" @click="toggleCollapse" :title="isCollapsed ? '展开' : '收起'">
          <i :class="isCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'"></i>
        </button>
        <button class="btn-icon" @click="$emit('add-category')" title="添加分类" v-if="!isCollapsed">
          <i class="bi bi-plus-circle"></i>
        </button>
      </div>
    </div>
    <div class="tree-content" v-if="!isCollapsed">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-item"
        :class="{ active: selectedCategory === category.name }"
        @click="selectCategory(category.name)"
      >
        <div class="category-header">
          <i class="bi bi-folder"></i>
          <span>{{ category.name }}</span>
        </div>
        <div v-if="category.children && category.children.length" class="category-children">
          <div 
            v-for="child in category.children" 
            :key="child.id"
            class="category-child"
            :class="{ active: selectedCategory === child.name }"
            @click.stop="selectCategory(child.name)"
          >
            <i class="bi bi-file-text"></i>
            <span>{{ child.name }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 拖拽调整手柄 -->
    <div 
      class="resize-handle"
      @mousedown="startResize"
      @touchstart="startResize"
      v-if="!isCollapsed"
    >
      <div class="resize-indicator">
        <i class="bi bi-grip-vertical"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'CategoryTree',
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    selectedCategory: {
      type: String,
      default: ''
    }
  },
  emits: ['category-selected', 'add-category', 'width-changed'],
  setup(props, { emit }) {
    const treeWidth = ref(250) // 默认宽度
    const minWidth = 200
    const maxWidth = 500
    const isCollapsed = ref(false)
    const isResizing = ref(false)

    // 拖拽调整宽度
    const startResize = (event) => {
      event.preventDefault()
      isResizing.value = true
      
      const startX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX
      const startWidth = treeWidth.value

      const handleMouseMove = (e) => {
        if (!isResizing.value) return
        
        const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
        const deltaX = currentX - startX
        const newWidth = Math.min(Math.max(startWidth + deltaX, minWidth), maxWidth)
        
        treeWidth.value = newWidth
        emit('width-changed', newWidth)
      }

      const handleMouseUp = () => {
        isResizing.value = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleMouseMove)
        document.removeEventListener('touchend', handleMouseUp)
        
        // 保存宽度到localStorage
        localStorage.setItem('knowledge-tree-width', treeWidth.value.toString())
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleMouseMove)
      document.addEventListener('touchend', handleMouseUp)
    }

    // 切换折叠状态
    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
      const newWidth = isCollapsed.value ? 50 : (parseInt(localStorage.getItem('knowledge-tree-width')) || 250)
      treeWidth.value = newWidth
      emit('width-changed', newWidth)
      
      // 保存折叠状态
      localStorage.setItem('knowledge-tree-collapsed', isCollapsed.value.toString())
    }

    // 选择分类
    const selectCategory = (categoryName) => {
      emit('category-selected', categoryName)
    }

    // 组件挂载时恢复状态
    onMounted(() => {
      // 恢复宽度
      const savedWidth = localStorage.getItem('knowledge-tree-width')
      if (savedWidth) {
        const width = parseInt(savedWidth)
        if (width >= minWidth && width <= maxWidth) {
          treeWidth.value = width
        }
      }
      
      // 恢复折叠状态
      const savedCollapsed = localStorage.getItem('knowledge-tree-collapsed')
      if (savedCollapsed !== null) {
        isCollapsed.value = savedCollapsed === 'true'
        if (isCollapsed.value) {
          treeWidth.value = 50
        }
      }
    })

    return {
      treeWidth,
      isCollapsed,
      isResizing,
      startResize,
      toggleCollapse,
      selectCategory
    }
  }
}
</script>

<style scoped>
.category-tree {
  position: relative;
  border-right: 1px solid #e0e0e0;
  background: #f8f9fa;
  transition: width 0.3s ease;
  min-width: 50px;
  max-width: 500px;
}

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
  min-height: 60px;
  box-sizing: border-box;
}

.tree-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tree-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn-icon {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.btn-icon:hover {
  background: #f0f0f0;
  color: #333;
  transform: scale(1.05);
}

.btn-icon:active {
  transform: scale(0.95);
}

.tree-content {
  padding: 8px 0;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  overflow-x: hidden;
}

.category-item {
  margin: 2px 8px;
  border-radius: 6px;
  overflow: hidden;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
}

.category-header:hover {
  background: #e9ecef;
}

.category-item.active > .category-header {
  background: #4a6cf7;
  color: white;
}

.category-children {
  background: rgba(0, 0, 0, 0.02);
}

.category-child {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 32px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
}

.category-child:hover {
  background: #e9ecef;
}

.category-child.active {
  background: #4a6cf7;
  color: white;
}

.category-child i {
  font-size: 12px;
  opacity: 0.7;
  flex-shrink: 0;
}

/* 拖拽调整手柄 */
.resize-handle {
  position: absolute;
  top: 0;
  right: -4px;
  width: 8px;
  height: 100%;
  cursor: ew-resize;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-handle:hover .resize-indicator {
  background: rgba(74, 108, 247, 0.6);
  width: 4px;
}

.resize-indicator {
  width: 2px;
  height: 40px;
  background: rgba(74, 108, 247, 0.3);
  border-radius: 1px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-indicator i {
  font-size: 10px;
  color: rgba(74, 108, 247, 0.8);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.resize-handle:hover .resize-indicator i {
  opacity: 1;
}

/* 拖拽时的视觉反馈 */
.category-tree:has(.resize-handle:active) {
  border-right-color: #4a6cf7;
}

.category-tree:has(.resize-handle:active) .resize-indicator {
  background: #4a6cf7;
  width: 4px;
}

/* 滚动条样式 */
.tree-content::-webkit-scrollbar {
  width: 6px;
}

.tree-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.tree-content::-webkit-scrollbar-thumb {
  background: rgba(74, 108, 247, 0.3);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.tree-content::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 108, 247, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-tree {
    min-width: 40px;
  }
  
  .tree-header {
    padding: 12px;
  }
  
  .tree-header h3 {
    font-size: 14px;
  }
  
  .btn-icon {
    width: 24px;
    height: 24px;
    padding: 4px;
  }
  
  .category-header,
  .category-child {
    padding: 6px 8px;
    font-size: 13px;
  }
  
  .category-child {
    padding-left: 24px;
  }
}

/* 折叠状态样式 */
.category-tree:has(.tree-content:not(:empty)) {
  /* 展开状态的特殊样式 */
}

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tree-content {
  animation: slideIn 0.3s ease-out;
}
</style>