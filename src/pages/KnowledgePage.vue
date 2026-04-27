<template>
  <div class="knowledge-page">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="搜索知识库..."
            @input="handleSearch"
          >
          <button class="search-btn" @click="handleSearch">
            <i class="bi bi-search"></i>
          </button>
        </div>
        <div class="filter-group">
          <select v-model="filterCategory" @change="applyFilters">
            <option value="">全部分类</option>
            <option v-for="cat in flatCategories" :key="cat.id" :value="cat.name">
              {{ cat.name }}
            </option>
          </select>
          <select v-model="filterStatus" @change="applyFilters">
            <option value="">全部状态</option>
            <option value="active">已发布</option>
            <option value="draft">草稿</option>
          </select>
        </div>
      </div>
      <div class="toolbar-right">
        <div class="action-buttons">
          <button class="btn btn-secondary" @click="handleImport">
            <i class="bi bi-upload"></i> 导入
          </button>
          <button class="btn btn-secondary" @click="handleExport">
            <i class="bi bi-download"></i> 导出
          </button>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="content-area">
      <!-- 分类树 -->
      <CategoryTree
        :categories="categories"
        :selected-category="selectedCategory"
        @category-selected="handleCategorySelected"
        @add-category="handleAddCategory"
        @width-changed="handleTreeWidthChanged"
      />

      <!-- 知识列表 -->
      <div class="knowledge-list-container" :style="{ marginLeft: treeWidthChanged ? '0' : 'auto' }">
        <KnowledgeList
          :knowledge-items="filteredKnowledge"
          @add-knowledge="handleAddKnowledge"
          @edit-knowledge="handleEditKnowledge"
          @delete-knowledge="handleDeleteKnowledge"
          @item-selected="handleItemSelected"
        />
      </div>
    </div>

    <!-- 知识编辑器 -->
    <KnowledgeEditor
      :is-visible="showEditor"
      :knowledge-item="currentKnowledge"
      :categories="categories"
      @save="handleSaveKnowledge"
      @cancel="handleCancelEdit"
    />
  </div>
</template>

<script>
import CategoryTree from '@/components/CategoryTree.vue'
import KnowledgeList from '@/components/KnowledgeList.vue'
import KnowledgeEditor from '@/components/KnowledgeEditor.vue'

export default {
  name: 'KnowledgePage',
  components: {
    CategoryTree,
    KnowledgeList,
    KnowledgeEditor
  },
  data() {
    return {
      // 数据状态
      categories: [],
      knowledgeItems: [],
      
      // 筛选状态
      selectedCategory: '',
      searchTerm: '',
      filterCategory: '',
      filterStatus: '',
      
      // 编辑器状态
      showEditor: false,
      currentKnowledge: null,
      
      // UI状态
      treeWidthChanged: false
    }
  },
  computed: {
    // 展平的分类列表，用于下拉选择
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
    
    // 过滤后的知识列表
    filteredKnowledge() {
      return this.knowledgeItems.filter(item => {
        const matchCategory = !this.filterCategory || item.category === this.filterCategory;
        const matchStatus = !this.filterStatus || item.status === this.filterStatus;
        const matchSearch = !this.searchTerm || 
          item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (item.tags && item.tags.some(tag => 
            tag.toLowerCase().includes(this.searchTerm.toLowerCase())
          ));
        const matchTreeCategory = !this.selectedCategory || item.category === this.selectedCategory;
        
        return matchCategory && matchStatus && matchSearch && matchTreeCategory;
      });
    }
  },
  async mounted() {
    await this.loadKnowledgeData();
  },
  methods: {
    // 加载知识库数据
    async loadKnowledgeData() {
      try {
        // 模拟从API或本地存储加载数据
        // 这里使用静态数据，实际项目中应该从API获取
        const response = await fetch('/src/page/data/knowledge.json');
        const data = await response.json();
        
        this.categories = data.categories || [];
        this.knowledgeItems = data.knowledgeItems || [];
      } catch (error) {
        console.error('加载知识库数据失败:', error);
        // 使用默认数据
        this.categories = [
          {
            id: 1,
            name: "产品文档",
            children: [
              { id: 11, name: "用户手册" },
              { id: 12, name: "API文档" }
            ]
          },
          {
            id: 2,
            name: "常见问题",
            children: [
              { id: 21, name: "安装问题" },
              { id: 22, name: "使用问题" }
            ]
          }
        ];
        this.knowledgeItems = [
          {
            id: 1,
            title: "如何安装 QuickSearch",
            category: "安装问题",
            content: "安装步骤说明...",
            tags: ["安装", "配置"],
            status: "active",
            createTime: "2024-04-27"
          },
          {
            id: 2,
            title: "API 接口说明",
            category: "API文档",
            content: "API 接口详细说明...",
            tags: ["API", "开发"],
            status: "active",
            createTime: "2024-04-27"
          }
        ];
      }
    },
    
    // 分类选择处理
    handleCategorySelected(categoryName) {
      this.selectedCategory = this.selectedCategory === categoryName ? '' : categoryName;
    },
    
    // 搜索处理
    handleSearch() {
      // 搜索逻辑已在computed中实现
    },
    
    // 应用筛选
    applyFilters() {
      // 筛选逻辑已在computed中实现
    },
    
    // 添加知识
    handleAddKnowledge() {
      this.currentKnowledge = null;
      this.showEditor = true;
    },
    
    // 编辑知识
    handleEditKnowledge(item) {
      this.currentKnowledge = { ...item };
      this.showEditor = true;
    },
    
    // 删除知识
    handleDeleteKnowledge(item) {
      if (confirm(`确定要删除知识"${item.title}"吗？`)) {
        const index = this.knowledgeItems.findIndex(k => k.id === item.id);
        if (index > -1) {
          this.knowledgeItems.splice(index, 1);
          this.saveKnowledgeData();
        }
      }
    },
    
    // 选择知识项
    handleItemSelected(item) {
      // 可以在这里实现预览功能
      console.log('选择了知识项:', item);
    },
    
    // 保存知识
    handleSaveKnowledge(knowledgeData) {
      if (knowledgeData.id) {
        // 更新现有知识
        const index = this.knowledgeItems.findIndex(k => k.id === knowledgeData.id);
        if (index > -1) {
          this.knowledgeItems.splice(index, 1, knowledgeData);
        }
      } else {
        // 添加新知识
        knowledgeData.id = Date.now(); // 简单的ID生成
        this.knowledgeItems.push(knowledgeData);
      }
      
      this.saveKnowledgeData();
      this.showEditor = false;
      this.currentKnowledge = null;
    },
    
    // 取消编辑
    handleCancelEdit() {
      this.showEditor = false;
      this.currentKnowledge = null;
    },
    
    // 添加分类
    handleAddCategory() {
      const categoryName = prompt('请输入分类名称:');
      if (categoryName && categoryName.trim()) {
        const newCategory = {
          id: Date.now(),
          name: categoryName.trim(),
          children: []
        };
        this.categories.push(newCategory);
        this.saveKnowledgeData();
      }
    },
    
    // 导入功能
    handleImport() {
      // TODO: 实现导入功能
      alert('导入功能待实现');
    },
    
    // 导出功能
    handleExport() {
      // TODO: 实现导出功能
      alert('导出功能待实现');
    },
    
    // 处理侧边栏宽度变化
    handleTreeWidthChanged(width) {
      this.treeWidthChanged = true;
      // 可以在这里处理宽度变化的其他逻辑
      console.log('侧边栏宽度变化:', width);
    },
    
    // 保存数据到本地存储
    saveKnowledgeData() {
      const data = {
        categories: this.categories,
        knowledgeItems: this.knowledgeItems
      };
      
      // 在实际项目中，这里应该调用API保存到服务器
      // 现在只是保存到localStorage作为演示
      localStorage.setItem('knowledgeData', JSON.stringify(data));
    }
  }
}
</script>

<style scoped>
.knowledge-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.search-box input {
  border: none;
  background: none;
  padding: 8px 12px;
  outline: none;
  width: 250px;
}

.search-btn {
  background: none;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.search-btn:hover {
  color: #333;
}

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-group select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.action-buttons {
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

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.knowledge-list-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>