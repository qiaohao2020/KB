<template>
  <div class="history-page">
    <!-- 搜索区域 -->
    <div class="search-box">
      <textarea 
        class="search-input" 
        v-model="searchText" 
        placeholder="请输入要搜索的文本段落..."
        @keydown.enter.prevent="search"
      ></textarea>
      <div class="search-actions">
        <div class="search-options">
          <div 
            class="search-option" 
            :class="{active: searchType === 'question'}" 
            @click="setSearchType('question')"
          >
            <i class="bi bi-question-circle"></i>
            <span>问题</span>
          </div>
          <div 
            class="search-option" 
            :class="{active: searchType === 'answer'}" 
            @click="setSearchType('answer')"
          >
            <i class="bi bi-chat-dots"></i>
            <span>回答</span>
          </div>
          <div 
            class="search-option" 
            :class="{active: searchType === 'both'}" 
            @click="setSearchType('both')"
          >
            <i class="bi bi-arrows-angle-contract"></i>
            <span>全部</span>
          </div>
        </div>
        <button 
          class="search-btn" 
          @click="search" 
          :disabled="isLoading || !searchText.trim()"
        >
          <i class="bi bi-search"></i>
          <span>搜索</span>
        </button>
      </div>
    </div>

    <!-- 搜索结果区域 -->
    <div class="search-results">
      <div v-if="isLoading" class="loading">
        <i class="bi bi-arrow-repeat"></i> 搜索中...
      </div>
      
      <div v-else-if="errorMessage" class="error">
        <i class="bi bi-exclamation-triangle"></i>
        {{ errorMessage }}
      </div>
      
      <div v-else-if="searchResults.length === 0 && hasSearched" class="empty-state">
        <i class="bi bi-search"></i>
        <h3>暂无搜索结果</h3>
        <p>尝试使用不同的关键词进行搜索</p>
      </div>
      
      <div v-else-if="searchResults.length === 0 && !hasSearched" class="empty-state">
        <i class="bi bi-clock-history"></i>
        <h3>历史问答搜索</h3>
        <p>在上方输入框中输入问题或关键词，搜索历史对话记录</p>
      </div>
      
      <div v-else>
        <div class="result-item" v-for="result in searchResults" :key="result.id">
          <div class="result-header">
            <div class="result-meta">
              <span><i class="bi bi-calendar3"></i> {{ result.date }}</span>
              <span><i class="bi bi-graph-up"></i> 相似度: {{ (result.similarity * 100).toFixed(2) }}%</span>
            </div>
          </div>
          <div class="result-content">
            <div class="message user">
              <div class="message-text">{{ result.question }}</div>
              <div class="message-time">{{ result.questionTime }}</div>
            </div>
            <div class="message ai">
              <div class="message-text">{{ result.answer }}</div>
              <div class="message-time">{{ result.answerTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'HistoryPage',
  setup() {
    const searchText = ref('')
    const searchType = ref('both')
    const searchResults = ref([])
    const isLoading = ref(false)
    const errorMessage = ref('')
    const hasSearched = ref(false)
    const historyData = ref([])

    // 加载历史数据
    async function loadHistoryData() {
      try {
        // 模拟历史对话数据
        historyData.value = [
          {
            id: 1,
            date: '2024-03-20',
            similarity: 0.85,
            question: '什么是人工智能？',
            questionTime: '10:30',
            answer: '人工智能（AI）是计算机科学的一个分支，它致力于创造能够模拟人类智能的机器。这些机器可以学习、推理、解决问题、理解自然语言、识别图像和声音等。AI的目标是让计算机能够执行通常需要人类智能才能完成的任务。',
            answerTime: '10:31'
          },
          {
            id: 2,
            date: '2024-03-19',
            similarity: 0.75,
            question: '机器学习有哪些主要类型？',
            questionTime: '15:45',
            answer: '机器学习主要分为三种类型：1. 监督学习：使用标记数据进行训练，如分类和回归问题；2. 无监督学习：从未标记数据中发现模式，如聚类和降维；3. 强化学习：通过与环境交互来学习最优策略，常用于游戏和机器人控制。',
            answerTime: '15:46'
          },
          {
            id: 3,
            date: '2024-03-18',
            similarity: 0.68,
            question: 'Vue.js 和 React 有什么区别？',
            questionTime: '09:20',
            answer: 'Vue.js 和 React 都是流行的前端框架，主要区别包括：1. 学习曲线：Vue.js 更容易上手；2. 模板语法：Vue 使用模板，React 使用 JSX；3. 状态管理：Vue 有 Vuex，React 有 Redux；4. 生态系统：React 生态更庞大；5. 性能：两者性能相近，都使用虚拟 DOM。',
            answerTime: '09:22'
          },
          {
            id: 4,
            date: '2024-03-17',
            similarity: 0.72,
            question: '如何优化网站性能？',
            questionTime: '14:15',
            answer: '网站性能优化可以从多个方面入手：1. 减少 HTTP 请求次数；2. 压缩和优化图片；3. 使用 CDN 加速；4. 启用浏览器缓存；5. 压缩 CSS 和 JavaScript；6. 使用懒加载；7. 优化数据库查询；8. 选择合适的服务器配置。',
            answerTime: '14:17'
          }
        ]
      } catch (error) {
        console.error('加载历史数据失败:', error)
        errorMessage.value = '加载历史数据失败'
      }
    }

    // 设置搜索类型
    function setSearchType(type) {
      searchType.value = type
      if (searchText.value.trim() && hasSearched.value) {
        search()
      }
    }

    // 搜索功能
    async function search() {
      if (!searchText.value.trim() || isLoading.value) return

      isLoading.value = true
      errorMessage.value = ''
      searchResults.value = []
      hasSearched.value = true

      try {
        // 模拟搜索延迟
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const searchTerm = searchText.value.toLowerCase().trim()
        
        // 根据搜索类型过滤结果
        let filteredResults = historyData.value.filter(item => {
          if (searchType.value === 'question') {
            return item.question.toLowerCase().includes(searchTerm)
          } else if (searchType.value === 'answer') {
            return item.answer.toLowerCase().includes(searchTerm)
          } else {
            return item.question.toLowerCase().includes(searchTerm) ||
                   item.answer.toLowerCase().includes(searchTerm)
          }
        })

        // 计算相似度（简化版本）
        filteredResults = filteredResults.map(item => {
          const questionMatch = item.question.toLowerCase().includes(searchTerm)
          const answerMatch = item.answer.toLowerCase().includes(searchTerm)
          
          let similarity = 0
          if (questionMatch && answerMatch) {
            similarity = 0.9
          } else if (questionMatch || answerMatch) {
            similarity = 0.7
          }
          
          return {
            ...item,
            similarity: similarity + Math.random() * 0.1 // 添加一些随机性
          }
        })

        // 按相似度排序
        searchResults.value = filteredResults.sort((a, b) => b.similarity - a.similarity)
        
      } catch (error) {
        console.error('搜索失败:', error)
        errorMessage.value = '搜索失败，请重试'
      } finally {
        isLoading.value = false
      }
    }

    // 组件挂载时加载数据
    onMounted(() => {
      loadHistoryData()
    })

    return {
      searchText,
      searchType,
      searchResults,
      isLoading,
      errorMessage,
      hasSearched,
      setSearchType,
      search
    }
  }
}
</script>

<style scoped>
/* 确保边框和样式正确显示 */

.history-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 搜索框样式 */
.search-box {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.search-box:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #4a6cf7;
}

.search-input {
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  resize: vertical;
  font-size: 15px;
  line-height: 1.6;
  transition: all 0.3s ease;
  font-family: inherit;
  background: #ffffff;
  color: #2d3748;
}

.search-input:focus {
  outline: none;
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.search-input::placeholder {
  color: #718096;
}

.search-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.search-options {
  display: flex;
  gap: 12px;
}

.search-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #718096;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
}

.search-option:hover {
  background: #ffffff;
  border-color: #4a6cf7;
  color: #4a6cf7;
}

.search-option.active {
  background: #4a6cf7;
  border-color: #4a6cf7;
  color: white;
}

.search-btn {
  background: #4a6cf7;
  color: white;
  border: 1px solid #4a6cf7;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.search-btn:hover:not(:disabled) {
  background: #3a5ce4;
  border-color: #3a5ce4;
  transform: translateY(-1px);
}

.search-btn:disabled {
  background: #718096;
  border-color: #718096;
  cursor: not-allowed;
  transform: none;
  opacity: 0.6;
}

/* 搜索结果样式 */
.search-results {
  flex: 1;
}

.result-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.result-item:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #4a6cf7;
  transform: translateY(-2px);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.result-meta {
  display: flex;
  gap: 20px;
  color: #718096;
  font-size: 0.9em;
}

.result-meta i {
  margin-right: 4px;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  line-height: 1.6;
  position: relative;
  transition: all 0.3s ease;
}

.message:hover {
  transform: translateX(4px);
}

.message.user {
  background: #e3f2fd;
  border-color: #bbdefb;
  align-self: flex-end;
  max-width: 80%;
  border-bottom-right-radius: 4px;
}

.message.ai {
  background: #f7fafc;
  border-color: #e2e8f0;
  align-self: flex-start;
  max-width: 80%;
  border-bottom-left-radius: 4px;
}

.message-text {
  font-size: 15px;
  color: #2d3748;
  margin-bottom: 8px;
}

.message-time {
  font-size: 0.8em;
  color: #718096;
  text-align: right;
}

/* 加载和错误状态 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #718096;
  font-size: 1.1em;
}

.loading i {
  margin-right: 12px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error {
  color: #dc3545;
  padding: 16px;
  background-color: #f8d7da;
  border-radius: 8px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #f5c6cb;
}

.error i {
  font-size: 1.2em;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 20px;
  color: #4a6cf7;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 12px 0;
  color: #2d3748;
}

.empty-state p {
  font-size: 1.1em;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-box {
    padding: 16px;
  }

  .search-actions {
    flex-direction: column;
    gap: 16px;
  }

  .search-options {
    width: 100%;
    justify-content: space-between;
  }

  .search-option {
    padding: 8px 12px;
    font-size: 0.9em;
  }

  .search-btn {
    width: 100%;
    justify-content: center;
  }

  .message {
    max-width: 90%;
  }

  .result-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>