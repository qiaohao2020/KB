<template>
  <div class="search-page">
    <!-- 顶部操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="输入关键词搜索..."
            @keyup.enter="performSearch"
          >
          <button class="search-btn" @click="performSearch">
            <i class="bi bi-search"></i>
          </button>
        </div>
        <div class="search-options">
          <div 
            class="search-option" 
            :class="{active: searchType === 'title'}" 
            @click="setSearchType('title')"
          >
            <i class="bi bi-type-h1"></i>
            <span>标题</span>
          </div>
          <div 
            class="search-option" 
            :class="{active: searchType === 'content'}" 
            @click="setSearchType('content')"
          >
            <i class="bi bi-file-text"></i>
            <span>内容</span>
          </div>
          <div 
            class="search-option" 
            :class="{active: searchType === 'tags'}" 
            @click="setSearchType('tags')"
          >
            <i class="bi bi-tags"></i>
            <span>标签</span>
          </div>
          <div 
            class="search-option" 
            :class="{active: searchType === 'rag'}" 
            @click="setSearchType('rag')"
          >
            <i class="bi bi-search"></i>
            <span>RAG</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索结果区域 -->
    <div class="search-results">
      <div class="results-header">
        <h3>搜索结果</h3>
        <span class="results-count">共找到 {{ filteredResults.length }} 条结果</span>
      </div>
      
      <div v-if="isLoading" class="loading">
        <i class="bi bi-arrow-repeat"></i> 搜索中...
      </div>
      
      <div v-else-if="errorMessage" class="error">
        {{ errorMessage }}
      </div>
      
      <div v-else-if="filteredResults.length === 0 && hasSearched" class="empty-state">
        <i class="bi bi-search"></i>
        <p>未找到相关结果</p>
      </div>
      
      <div v-else class="results-list">
        <div class="result-item" v-for="item in filteredResults" :key="item.id">
          <div class="result-header">
            <h4>{{ item.title }}</h4>
            <div class="result-meta">
              <span class="category">{{ item.category }}</span>
              <span class="time">{{ item.createTime }}</span>
            </div>
          </div>
          <div class="result-content">
            <p>{{ item.content }}</p>
            <div class="result-tags" v-if="item.tags && item.tags.length">
              <span class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'SearchPage',
  setup() {
    const searchTerm = ref('')
    const searchType = ref('rag')
    const knowledgeData = ref([])
    const searchResults = ref([])
    const isLoading = ref(false)
    const errorMessage = ref('')
    const hasSearched = ref(false)

    // 计算过滤后的结果
    const filteredResults = computed(() => {
      return searchResults.value
    })

    // 加载知识库数据
    async function loadKnowledgeData() {
      try {
        // 模拟加载知识库数据
        knowledgeData.value = [
          {
            id: 1,
            title: 'Vue.js 基础教程',
            content: 'Vue.js 是一个渐进式 JavaScript 框架，用于构建用户界面。它易于学习，功能强大。',
            category: '前端开发',
            tags: ['Vue.js', 'JavaScript', '前端'],
            createTime: '2024-03-20 10:30'
          },
          {
            id: 2,
            title: 'JavaScript 异步编程',
            content: '异步编程是 JavaScript 的重要特性，包括 Promise、async/await 等概念。',
            category: '编程语言',
            tags: ['JavaScript', '异步', 'Promise'],
            createTime: '2024-03-19 15:45'
          },
          {
            id: 3,
            title: 'CSS 布局技巧',
            content: 'CSS 提供了多种布局方式，包括 Flexbox、Grid 等现代布局技术。',
            category: '前端开发',
            tags: ['CSS', '布局', 'Flexbox'],
            createTime: '2024-03-18 09:20'
          }
        ]
        
        // 为每个知识条目生成向量
        await initVectorDB()
      } catch (error) {
        console.error('加载知识库数据失败:', error)
        errorMessage.value = '加载知识库数据失败'
      }
    }

    // 初始化向量数据库
    async function initVectorDB() {
      try {
        for (const item of knowledgeData.value) {
          const text = `${item.title} ${item.content} ${item.tags.join(' ')}`
          const vector = await generateEmbedding(text)
          item.vector = vector
        }
      } catch (error) {
        console.error('初始化向量数据库失败:', error)
        errorMessage.value = '初始化向量数据库失败'
      }
    }

    // 生成文本向量（简化版本）
    async function generateEmbedding(text) {
      try {
        const tokens = text.toLowerCase().split(/\s+/)
        const vector = {}
        tokens.forEach(token => {
          vector[token] = (vector[token] || 0) + 1
        })
        return vector
      } catch (error) {
        console.error('生成向量失败:', error)
        throw error
      }
    }

    // 计算向量相似度
    function cosineSimilarity(vec1, vec2) {
      const keys = new Set([...Object.keys(vec1), ...Object.keys(vec2)])
      let dotProduct = 0
      let norm1 = 0
      let norm2 = 0

      for (const key of keys) {
        const v1 = vec1[key] || 0
        const v2 = vec2[key] || 0
        dotProduct += v1 * v2
        norm1 += v1 * v1
        norm2 += v2 * v2
      }

      norm1 = Math.sqrt(norm1)
      norm2 = Math.sqrt(norm2)

      if (norm1 === 0 || norm2 === 0) return 0
      return dotProduct / (norm1 * norm2)
    }

    // RAG搜索
    async function ragSearch() {
      if (!searchTerm.value) {
        searchResults.value = []
        return
      }

      isLoading.value = true
      errorMessage.value = ''

      try {
        // 生成查询向量
        const queryVector = await generateEmbedding(searchTerm.value)
        
        // 计算相似度并排序
        const results = knowledgeData.value.map(item => ({
          ...item,
          similarity: cosineSimilarity(queryVector, item.vector)
        })).sort((a, b) => b.similarity - a.similarity)

        // 只返回相似度大于阈值的结果
        const threshold = 0.1
        searchResults.value = results.filter(item => item.similarity > threshold)
      } catch (error) {
        console.error('RAG搜索失败:', error)
        errorMessage.value = '搜索失败，请重试'
      } finally {
        isLoading.value = false
      }
    }

    // 传统搜索功能
    function traditionalSearch() {
      if (!searchTerm.value) {
        searchResults.value = []
        return
      }

      const term = searchTerm.value.toLowerCase()
      const type = searchType.value
      
      searchResults.value = knowledgeData.value.filter(item => {
        if (type === 'title') {
          return item.title.toLowerCase().includes(term)
        } else if (type === 'content') {
          return item.content.toLowerCase().includes(term)
        } else if (type === 'tags') {
          return item.tags.some(tag => tag.toLowerCase().includes(term))
        } else {
          return item.title.toLowerCase().includes(term) ||
                 item.content.toLowerCase().includes(term) ||
                 item.tags.some(tag => tag.toLowerCase().includes(term))
        }
      })
    }

    // 设置搜索类型
    function setSearchType(type) {
      searchType.value = type
      if (searchTerm.value && hasSearched.value) {
        performSearch()
      }
    }

    // 执行搜索
    function performSearch() {
      hasSearched.value = true
      if (searchType.value === 'rag') {
        ragSearch()
      } else {
        traditionalSearch()
      }
    }

    // 组件挂载时加载数据
    onMounted(() => {
      loadKnowledgeData()
    })

    return {
      searchTerm,
      searchType,
      searchResults,
      filteredResults,
      isLoading,
      errorMessage,
      hasSearched,
      setSearchType,
      performSearch
    }
  }
}
</script>

<style scoped>
.search-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 搜索框样式 */
.toolbar {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.toolbar-left {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
  width: 100%;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 14px;
}

.search-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.search-btn:hover {
  color: #0d6efd;
  background-color: #f8f9fa;
}

.search-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.search-option {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6c757d;
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
}

.search-option:hover {
  background-color: #e9ecef;
  color: #495057;
}

.search-option.active {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

/* 搜索结果样式 */
.search-results {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.results-header h3 {
  margin: 0;
  color: #333;
}

.results-count {
  color: #6c757d;
  font-size: 0.9em;
}

.result-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  transition: all 0.2s;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background-color: #f8f9fa;
  border-radius: 8px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.result-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.1em;
  flex: 1;
}

.result-meta {
  display: flex;
  gap: 15px;
  color: #6c757d;
  font-size: 0.9em;
  flex-shrink: 0;
}

.result-content {
  color: #495057;
  line-height: 1.6;
}

.result-content p {
  margin: 0 0 10px 0;
}

.result-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background-color: #e9ecef;
  color: #495057;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

/* 加载和错误状态样式 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #6c757d;
}

.loading i {
  margin-right: 10px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error {
  color: #dc3545;
  padding: 15px;
  background-color: #f8d7da;
  border-radius: 8px;
  margin: 10px 0;
  border: 1px solid #f5c6cb;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.1em;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolbar-left {
    gap: 10px;
  }
  
  .search-options {
    gap: 8px;
  }
  
  .search-option {
    padding: 6px 12px;
    font-size: 0.9em;
  }
  
  .result-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .result-meta {
    gap: 10px;
  }
}
</style>