<template>
  <div class="knowledge-editor" :class="{ 'is-visible': isVisible }">
    <div class="editor-header">
      <h2>{{ isEditing ? '编辑知识' : '新增知识' }}</h2>
      <div class="editor-actions">
        <button class="btn btn-save" @click="handleSave" :disabled="!isFormValid">
          <i class="bi bi-check-lg"></i> 保存
        </button>
        <button class="btn btn-cancel" @click="handleCancel">
          <i class="bi bi-x-lg"></i> 取消
        </button>
      </div>
    </div>
    
    <div class="editor-content">
      <form @submit.prevent="handleSave">
        <div class="form-group">
          <label for="title">标题 <span class="required">*</span></label>
          <input 
            id="title"
            type="text" 
            v-model="formData.title" 
            placeholder="请输入知识标题"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="category">分类 <span class="required">*</span></label>
          <select id="category" v-model="formData.category" required>
            <option value="">请选择分类</option>
            <option v-for="cat in flatCategories" :key="cat.id" :value="cat.name">
              {{ cat.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="content">内容 <span class="required">*</span></label>
          <textarea 
            id="content"
            v-model="formData.content" 
            rows="10" 
            placeholder="请输入知识内容"
            required
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="tags">标签</label>
          <div class="tags-input">
            <input 
              id="tags"
              type="text" 
              v-model="tagInput"
              @keydown.enter.prevent="addTag"
              @keydown.comma.prevent="addTag"
              placeholder="输入标签后按回车或逗号添加"
            >
            <div v-if="formData.tags.length" class="tags-preview">
              <span 
                v-for="(tag, index) in formData.tags" 
                :key="index" 
                class="tag"
              >
                {{ tag }}
                <button type="button" @click="removeTag(index)" class="tag-remove">
                  <i class="bi bi-x"></i>
                </button>
              </span>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="status">状态</label>
          <div class="status-select">
            <select id="status" v-model="formData.status">
              <option value="draft">草稿</option>
              <option value="active">发布</option>
            </select>
            <span class="status-badge" :class="formData.status">
              {{ formData.status === 'active' ? '已发布' : '草稿' }}
            </span>
          </div>
        </div>
        
        <div v-if="isEditing" class="form-group">
          <label>创建时间</label>
          <input type="text" :value="formData.createTime" readonly>
        </div>
        
        <div v-if="isEditing" class="form-group">
          <label>更新时间</label>
          <input type="text" :value="currentTime" readonly>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KnowledgeEditor',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    knowledgeItem: {
      type: Object,
      default: null
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      formData: {
        id: null,
        title: '',
        category: '',
        content: '',
        tags: [],
        status: 'draft',
        createTime: ''
      },
      tagInput: ''
    }
  },
  computed: {
    isEditing() {
      return this.knowledgeItem && this.knowledgeItem.id;
    },
    isFormValid() {
      return this.formData.title.trim() && 
             this.formData.category && 
             this.formData.content.trim();
    },
    flatCategories() {
      let result = [];
      this.categories.forEach(cat => {
        result.push({ id: cat.id, name: cat.name });
        if (cat.children) {
          result = result.concat(cat.children.map(child => ({ 
            id: child.id, 
            name: child.name 
          })));
        }
      });
      return result;
    },
    currentTime() {
      return new Date().toISOString().split('T')[0];
    }
  },
  watch: {
    knowledgeItem: {
      handler(newItem) {
        if (newItem) {
          this.formData = {
            id: newItem.id,
            title: newItem.title || '',
            category: newItem.category || '',
            content: newItem.content || '',
            tags: [...(newItem.tags || [])],
            status: newItem.status || 'draft',
            createTime: newItem.createTime || ''
          };
        } else {
          this.resetForm();
        }
      },
      immediate: true
    },
    isVisible(newVal) {
      if (!newVal) {
        this.tagInput = '';
      }
    }
  },
  methods: {
    resetForm() {
      this.formData = {
        id: null,
        title: '',
        category: '',
        content: '',
        tags: [],
        status: 'draft',
        createTime: ''
      };
      this.tagInput = '';
    },
    addTag() {
      const tag = this.tagInput.trim();
      if (tag && !this.formData.tags.includes(tag)) {
        this.formData.tags.push(tag);
        this.tagInput = '';
      }
    },
    removeTag(index) {
      this.formData.tags.splice(index, 1);
    },
    handleSave() {
      if (!this.isFormValid) return;
      
      const saveData = {
        ...this.formData,
        createTime: this.formData.createTime || this.currentTime,
        updateTime: this.currentTime
      };
      
      this.$emit('save', saveData);
    },
    handleCancel() {
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>
.knowledge-editor {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e0e0e0;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.knowledge-editor.is-visible {
  right: 0;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.editor-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.editor-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-save {
  background: #28a745;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #218838;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #545b62;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.required {
  color: #dc3545;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.tags-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tags-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-remove {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #666;
  font-size: 10px;
}

.tag-remove:hover {
  color: #333;
}

.status-select {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-select select {
  flex: 1;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.draft {
  background: #fff3cd;
  color: #856404;
}

.form-group input[readonly] {
  background: #f8f9fa;
  color: #666;
}
</style>