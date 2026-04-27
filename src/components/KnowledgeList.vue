<template>
  <div class="knowledge-list">
    <div class="list-header">
      <div class="list-info">
        <span class="total-count">共 <span>{{ knowledgeItems.length }}</span> 条知识</span>
      </div>
      <div class="list-actions">
        <button class="btn btn-primary" @click="$emit('add-knowledge')">
          <i class="bi bi-plus-lg"></i> 添加知识
        </button>
      </div>
    </div>
    
    <div class="list-content">
      <div 
        v-for="item in knowledgeItems" 
        :key="item.id"
        class="knowledge-item"
        @click="$emit('item-selected', item)"
      >
        <div class="item-header">
          <h3>{{ item.title }}</h3>
          <div class="item-meta">
            <span class="category">{{ item.category }}</span>
            <span class="status" :class="item.status">
              {{ item.status === 'active' ? '已发布' : '草稿' }}
            </span>
            <span class="time">{{ item.createTime }}</span>
            <div class="item-actions" @click.stop>
              <button class="btn-icon" @click="$emit('edit-knowledge', item)" title="编辑">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn-icon" @click="$emit('delete-knowledge', item)" title="删除">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="item-content">
          <p>{{ truncateContent(item.content) }}</p>
          <div v-if="item.tags && item.tags.length" class="item-tags">
            <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="knowledgeItems.length === 0" class="empty-state">
        <i class="bi bi-journal-text" style="font-size: 48px; color: #ccc;"></i>
        <h3>暂无知识内容</h3>
        <p>点击"添加知识"按钮创建您的第一条知识</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KnowledgeList',
  props: {
    knowledgeItems: {
      type: Array,
      default: () => []
    }
  },
  emits: ['add-knowledge', 'edit-knowledge', 'delete-knowledge', 'item-selected'],
  methods: {
    truncateContent(content, maxLength = 150) {
      if (!content) return '';
      return content.length > maxLength 
        ? content.substring(0, maxLength) + '...' 
        : content;
    }
  }
}
</script>

<style scoped>
.knowledge-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
}

.total-count {
  color: #666;
  font-size: 14px;
}

.total-count span {
  font-weight: 600;
  color: #333;
}

.list-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.list-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.knowledge-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.knowledge-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.item-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.category {
  background: #f8f9fa;
  color: #495057;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.status {
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status.draft {
  background: #fff3cd;
  color: #856404;
}

.time {
  color: #666;
}

.item-actions {
  display: flex;
  gap: 4px;
}

.btn-icon {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f0f0f0;
  color: #333;
}

.item-content p {
  margin: 0 0 12px 0;
  color: #666;
  line-height: 1.5;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state h3 {
  margin: 20px 0 10px 0;
  color: #666;
}

.empty-state p {
  margin: 0;
  color: #999;
}
</style>