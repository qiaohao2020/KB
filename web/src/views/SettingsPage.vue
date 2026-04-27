<template>
  <div class="settings-page">
    <div class="page-header">
      <h1>设置</h1>
      <p>配置应用程序的各项参数</p>
    </div>
    
    <div class="settings-content">
      <!-- 通用设置 -->
      <div class="settings-section">
        <div class="section-header">
          <i class="bi bi-gear"></i>
          <h3>通用设置</h3>
        </div>
        <div class="settings-group">
          <div class="setting-item">
            <div class="setting-info">
              <label>主题模式</label>
              <p>选择应用的外观主题</p>
            </div>
            <div class="setting-control">
              <select v-model="settings.theme" @change="saveSettings">
                <option value="light">浅色主题</option>
                <option value="dark">深色主题</option>
                <option value="auto">跟随系统</option>
              </select>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <label>语言设置</label>
              <p>选择界面显示语言</p>
            </div>
            <div class="setting-control">
              <select v-model="settings.language" @change="saveSettings">
                <option value="zh-CN">简体中文</option>
                <option value="zh-TW">繁体中文</option>
                <option value="en-US">English</option>
              </select>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <label>自动保存</label>
              <p>自动保存编辑的内容</p>
            </div>
            <div class="setting-control">
              <label class="switch">
                <input 
                  type="checkbox" 
                  v-model="settings.autoSave" 
                  @change="saveSettings"
                >
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- AI配置 -->
      <div class="settings-section">
        <div class="section-header">
          <i class="bi bi-robot"></i>
          <h3>AI配置</h3>
        </div>
        <div class="settings-group">
          <div class="setting-item">
            <div class="setting-info">
              <label>API提供商</label>
              <p>选择AI服务提供商</p>
            </div>
            <div class="setting-control">
              <select v-model="settings.aiProvider" @change="saveSettings">
                <option value="openai">OpenAI</option>
                <option value="azure">Azure OpenAI</option>
                <option value="anthropic">Anthropic Claude</option>
                <option value="custom">自定义</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>API Base URL</label>
              <p>API服务的基础URL地址</p>
            </div>
            <div class="setting-control">
              <input 
                type="url" 
                v-model="settings.apiBaseUrl" 
                @blur="saveSettings"
                :placeholder="getDefaultApiUrl()"
                class="text-input"
              >
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>API Key</label>
              <p>用于身份验证的API密钥</p>
            </div>
            <div class="setting-control">
              <div class="password-input">
                <input 
                  :type="showApiKey ? 'text' : 'password'"
                  v-model="settings.apiKey" 
                  @blur="saveSettings"
                  placeholder="输入您的API Key"
                  class="text-input"
                >
                <button 
                  type="button" 
                  @click="showApiKey = !showApiKey"
                  class="toggle-password"
                >
                  <i :class="showApiKey ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="setting-item" v-if="settings.aiProvider === 'azure'">
            <div class="setting-info">
              <label>Azure API Version</label>
              <p>Azure OpenAI API版本</p>
            </div>
            <div class="setting-control">
              <select v-model="settings.azureApiVersion" @change="saveSettings">
                <option value="2024-02-15-preview">2024-02-15-preview</option>
                <option value="2023-12-01-preview">2023-12-01-preview</option>
                <option value="2023-05-15">2023-05-15</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>默认模型</label>
              <p>选择默认使用的AI模型</p>
            </div>
            <div class="setting-control">
              <select v-model="settings.defaultModel" @change="saveSettings">
                <optgroup v-if="settings.aiProvider === 'openai'" label="OpenAI Models">
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </optgroup>
                <optgroup v-if="settings.aiProvider === 'anthropic'" label="Claude Models">
                  <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                  <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                  <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                </optgroup>
                <optgroup v-if="settings.aiProvider === 'azure'" label="Azure Models">
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-35-turbo">GPT-3.5 Turbo</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>温度设置</label>
              <p>控制AI回复的创造性 ({{ settings.temperature }})</p>
            </div>
            <div class="setting-control">
              <input 
                type="range" 
                min="0" 
                max="2" 
                step="0.1" 
                v-model="settings.temperature" 
                @change="saveSettings"
                class="range-slider"
              >
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>最大Token数</label>
              <p>单次对话的最大Token限制</p>
            </div>
            <div class="setting-control">
              <select v-model="settings.maxTokens" @change="saveSettings">
                <option value="1000">1,000</option>
                <option value="2000">2,000</option>
                <option value="4000">4,000</option>
                <option value="8000">8,000</option>
                <option value="16000">16,000</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>系统提示词</label>
              <p>设置AI助手的行为和角色</p>
            </div>
            <div class="setting-control">
              <textarea 
                v-model="settings.systemPrompt" 
                @blur="saveSettings"
                placeholder="你是一个有用的AI助手..."
                class="textarea-input"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>连接测试</label>
              <p>测试API配置是否正确</p>
            </div>
            <div class="setting-control">
              <button 
                class="btn btn-outline" 
                @click="testApiConnection"
                :disabled="testingConnection"
              >
                <i :class="testingConnection ? 'bi bi-arrow-repeat spin' : 'bi bi-wifi'"></i>
                {{ testingConnection ? '测试中...' : '测试连接' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 聊天设置 -->
      <div class="settings-section">
        <div class="section-header">
          <i class="bi bi-chat-dots"></i>
          <h3>聊天设置</h3>
        </div>
        <div class="settings-group">
          <div class="setting-item">
            <div class="setting-info">
              <label>消息通知</label>
              <p>接收新消息时显示通知</p>
            </div>
            <div class="setting-control">
              <label class="switch">
                <input 
                  type="checkbox" 
                  v-model="settings.notifications" 
                  @change="saveSettings"
                >
                <span class="slider"></span>
              </label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <label>消息历史保留</label>
              <p>设置消息历史的保留天数</p>
            </div>
            <div class="setting-control">
              <select v-model="settings.messageRetentionDays" @change="saveSettings">
                <option value="7">7天</option>
                <option value="30">30天</option>
                <option value="90">90天</option>
                <option value="365">1年</option>
                <option value="-1">永久保留</option>
              </select>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <label>发送快捷键</label>
              <p>设置发送消息的快捷键</p>
            </div>
            <div class="setting-control">
              <select v-model="settings.sendShortcut" @change="saveSettings">
                <option value="enter">Enter</option>
                <option value="ctrl+enter">Ctrl + Enter</option>
                <option value="shift+enter">Shift + Enter</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 知识库设置 -->
      <div class="settings-section">
        <div class="section-header">
          <i class="bi bi-book"></i>
          <h3>知识库设置</h3>
        </div>
        <div class="settings-group">
          <div class="setting-item">
            <div class="setting-info">
              <label>搜索结果数量</label>
              <p>每页显示的搜索结果数量</p>
            </div>
            <div class="setting-control">
              <select v-model="settings.searchResultsPerPage" @change="saveSettings">
                <option value="10">10条</option>
                <option value="20">20条</option>
                <option value="50">50条</option>
                <option value="100">100条</option>
              </select>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <label>自动分类</label>
              <p>自动为新添加的知识分类</p>
            </div>
            <div class="setting-control">
              <label class="switch">
                <input 
                  type="checkbox" 
                  v-model="settings.autoClassify" 
                  @change="saveSettings"
                >
                <span class="slider"></span>
              </label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <label>RAG搜索阈值</label>
              <p>设置RAG搜索的相似度阈值 ({{ settings.ragThreshold }})</p>
            </div>
            <div class="setting-control">
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.1" 
                v-model="settings.ragThreshold" 
                @change="saveSettings"
                class="range-slider"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="settings-section">
        <div class="section-header">
          <i class="bi bi-database"></i>
          <h3>数据管理</h3>
        </div>
        <div class="settings-group">
          <div class="setting-item">
            <div class="setting-info">
              <label>数据导出</label>
              <p>导出所有数据到本地文件</p>
            </div>
            <div class="setting-control">
              <button class="btn btn-outline" @click="exportData">
                <i class="bi bi-download"></i>
                导出数据
              </button>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <label>数据导入</label>
              <p>从本地文件导入数据</p>
            </div>
            <div class="setting-control">
              <input 
                type="file" 
                ref="fileInput" 
                @change="importData" 
                accept=".json"
                style="display: none"
              >
              <button class="btn btn-outline" @click="$refs.fileInput.click()">
                <i class="bi bi-upload"></i>
                导入数据
              </button>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <label>清除所有数据</label>
              <p>删除所有聊天记录和知识库数据</p>
            </div>
            <div class="setting-control">
              <button class="btn btn-danger" @click="clearAllData">
                <i class="bi bi-trash"></i>
                清除数据
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>

    <!-- 保存状态提示 -->
    <div v-if="saveStatus" class="save-status" :class="saveStatus.type">
      <i :class="saveStatus.icon"></i>
      {{ saveStatus.message }}
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

export default {
  name: 'SettingsPage',
  setup() {
    const settings = reactive({
      // AI配置
      aiProvider: 'openai',
      apiBaseUrl: '',
      apiKey: '',
      azureApiVersion: '2024-02-15-preview',
      defaultModel: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 4000,
      systemPrompt: '你是一个有用的AI助手，能够帮助用户解答问题、处理任务和提供建议。请用简洁、准确、友好的方式回复用户。',
      
      // 通用设置
      theme: 'light',
      language: 'zh-CN',
      autoSave: true,
      notifications: true,
      messageRetentionDays: 30,
      sendShortcut: 'enter',
      searchResultsPerPage: 20,
      autoClassify: true,
      ragThreshold: 0.3
    })

    const saveStatus = ref(null)
    const showApiKey = ref(false)
    const testingConnection = ref(false)

    // 加载设置
    async function loadSettings() {
      try {
        // 从 chrome.storage 或 localStorage 加载设置
        const savedSettings = localStorage.getItem('quicksearch-settings')
        if (savedSettings) {
          Object.assign(settings, JSON.parse(savedSettings))
        }
      } catch (error) {
        console.error('加载设置失败:', error)
      }
    }

    // 保存设置
    async function saveSettings() {
      try {
        localStorage.setItem('quicksearch-settings', JSON.stringify(settings))
        showSaveStatus('success', '设置已保存', 'bi bi-check-circle')
        
        // 应用主题设置
        applyTheme(settings.theme)
      } catch (error) {
        console.error('保存设置失败:', error)
        showSaveStatus('error', '保存失败', 'bi bi-x-circle')
      }
    }

    // 显示保存状态
    function showSaveStatus(type, message, icon) {
      saveStatus.value = { type, message, icon }
      setTimeout(() => {
        saveStatus.value = null
      }, 3000)
    }

    // 应用主题
    function applyTheme(theme) {
      const root = document.documentElement
      if (theme === 'dark') {
        root.classList.add('dark-theme')
      } else if (theme === 'light') {
        root.classList.remove('dark-theme')
      } else {
        // auto - 跟随系统
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) {
          root.classList.add('dark-theme')
        } else {
          root.classList.remove('dark-theme')
        }
      }
    }

    // 导出数据
    async function exportData() {
      try {
        const data = {
          settings: settings,
          chatHistory: JSON.parse(localStorage.getItem('quicksearch-chat-history') || '[]'),
          knowledgeBase: JSON.parse(localStorage.getItem('quicksearch-knowledge-base') || '[]'),
          exportDate: new Date().toISOString()
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `quicksearch-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        showSaveStatus('success', '数据导出成功', 'bi bi-check-circle')
      } catch (error) {
        console.error('导出数据失败:', error)
        showSaveStatus('error', '导出失败', 'bi bi-x-circle')
      }
    }

    // 导入数据
    async function importData(event) {
      const file = event.target.files[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        if (data.settings) {
          Object.assign(settings, data.settings)
        }
        if (data.chatHistory) {
          localStorage.setItem('quicksearch-chat-history', JSON.stringify(data.chatHistory))
        }
        if (data.knowledgeBase) {
          localStorage.setItem('quicksearch-knowledge-base', JSON.stringify(data.knowledgeBase))
        }

        await saveSettings()
        showSaveStatus('success', '数据导入成功', 'bi bi-check-circle')
      } catch (error) {
        console.error('导入数据失败:', error)
        showSaveStatus('error', '导入失败，请检查文件格式', 'bi bi-x-circle')
      }

      // 清空文件输入
      event.target.value = ''
    }

    // 清除所有数据
    async function clearAllData() {
      if (!confirm('确定要清除所有数据吗？此操作不可恢复！')) {
        return
      }

      try {
        localStorage.removeItem('quicksearch-chat-history')
        localStorage.removeItem('quicksearch-knowledge-base')
        localStorage.removeItem('quicksearch-settings')
        
        // 重置设置为默认值
        Object.assign(settings, {
          theme: 'light',
          language: 'zh-CN',
          autoSave: true,
          notifications: true,
          messageRetentionDays: 30,
          sendShortcut: 'enter',
          searchResultsPerPage: 20,
          autoClassify: true,
          ragThreshold: 0.3
        })

        showSaveStatus('success', '数据已清除', 'bi bi-check-circle')
      } catch (error) {
        console.error('清除数据失败:', error)
        showSaveStatus('error', '清除失败', 'bi bi-x-circle')
      }
    }

    // 获取默认API URL
    function getDefaultApiUrl() {
      const urls = {
        openai: 'https://api.openai.com/v1',
        anthropic: 'https://api.anthropic.com',
        azure: 'https://your-resource.openai.azure.com',
        custom: '请输入自定义API地址'
      }
      return urls[settings.aiProvider] || ''
    }

    // 测试API连接
    async function testApiConnection() {
      if (!settings.apiKey) {
        showSaveStatus('error', '请先配置API Key', 'bi bi-x-circle')
        return
      }

      testingConnection.value = true
      
      try {
        const baseUrl = settings.apiBaseUrl || getDefaultApiUrl()
        let testUrl = ''
        let headers = {}

        if (settings.aiProvider === 'openai') {
          testUrl = `${baseUrl}/models`
          headers = {
            'Authorization': `Bearer ${settings.apiKey}`,
            'Content-Type': 'application/json'
          }
        } else if (settings.aiProvider === 'anthropic') {
          testUrl = `${baseUrl}/v1/messages`
          headers = {
            'x-api-key': settings.apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          }
          // 对于Claude，我们发送一个简单的测试请求
        } else if (settings.aiProvider === 'azure') {
          testUrl = `${baseUrl}/openai/deployments/${settings.defaultModel}/chat/completions?api-version=${settings.azureApiVersion}`
          headers = {
            'api-key': settings.apiKey,
            'Content-Type': 'application/json'
          }
        }

        // 发送测试请求
        const response = await fetch(testUrl, {
          method: settings.aiProvider === 'openai' ? 'GET' : 'POST',
          headers: headers,
          body: settings.aiProvider !== 'openai' ? JSON.stringify({
            model: settings.defaultModel,
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 1
          }) : undefined
        })

        if (response.ok || response.status === 400) {
          // 400也算成功，因为这表示API可达但请求格式问题
          showSaveStatus('success', 'API连接测试成功', 'bi bi-check-circle')
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.error('API连接测试失败:', error)
        showSaveStatus('error', `连接测试失败: ${error.message}`, 'bi bi-x-circle')
      } finally {
        testingConnection.value = false
      }
    }

    // 重置AI配置为默认值
    function resetAiSettings() {
      if (!confirm('确定要重置AI配置为默认值吗？')) {
        return
      }

      settings.aiProvider = 'openai'
      settings.apiBaseUrl = ''
      settings.apiKey = ''
      settings.azureApiVersion = '2024-02-15-preview'
      settings.defaultModel = 'gpt-4o-mini'
      settings.temperature = 0.7
      settings.maxTokens = 4000
      settings.systemPrompt = '你是一个有用的AI助手，能够帮助用户解答问题、处理任务和提供建议。请用简洁、准确、友好的方式回复用户。'
      
      saveSettings()
      showSaveStatus('success', 'AI配置已重置', 'bi bi-check-circle')
    }

    // 组件挂载时加载设置
    onMounted(() => {
      loadSettings()
      applyTheme(settings.theme)
    })

    return {
      settings,
      saveStatus,
      showApiKey,
      testingConnection,
      saveSettings,
      exportData,
      importData,
      clearAllData,
      getDefaultApiUrl,
      testApiConnection,
      resetAiSettings
    }
  }
}
</script>

<style scoped>
.settings-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.settings-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.section-header i {
  font-size: 20px;
  color: #4a6cf7;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-info label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.setting-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.setting-control {
  flex-shrink: 0;
  margin-left: 20px;
}

.setting-control select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 14px;
  min-width: 120px;
}

.setting-control select:focus {
  outline: none;
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

/* 文本输入框样式 */
.text-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 14px;
  min-width: 200px;
  width: 100%;
  max-width: 300px;
}

.text-input:focus {
  outline: none;
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.text-input::placeholder {
  color: #9ca3af;
}

/* 密码输入框样式 */
.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input .text-input {
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #4a6cf7;
}

/* 文本域样式 */
.textarea-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 14px;
  width: 100%;
  max-width: 400px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.4;
}

.textarea-input:focus {
  outline: none;
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.textarea-input::placeholder {
  color: #9ca3af;
}

/* 旋转动画 */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4a6cf7;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* 范围滑块样式 */
.range-slider {
  width: 120px;
  height: 6px;
  border-radius: 3px;
  background: #d1d5db;
  outline: none;
  -webkit-appearance: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4a6cf7;
  cursor: pointer;
}

.range-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4a6cf7;
  cursor: pointer;
  border: none;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  border: none;
}

.btn-outline {
  background: white;
  color: #4a6cf7;
  border: 1px solid #4a6cf7;
}

.btn-outline:hover {
  background: #4a6cf7;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border: 1px solid #dc3545;
}

.btn-danger:hover {
  background: #c82333;
  border-color: #c82333;
}



/* 保存状态提示 */
.save-status {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.save-status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.save-status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-section {
    padding: 16px;
    margin-bottom: 16px;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .setting-control {
    margin-left: 0;
    width: 100%;
  }

  .setting-control select {
    width: 100%;
  }

  .about-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .links {
    width: 100%;
  }
}

/* 深色主题支持 */
:global(.dark-theme) .settings-section {
  background: #1a202c;
  border-color: #2d3748;
}

:global(.dark-theme) .section-header h3,
:global(.dark-theme) .setting-info label,
:global(.dark-theme) .app-info h4 {
  color: #f7fafc;
}

:global(.dark-theme) .setting-info p,
:global(.dark-theme) .app-info p {
  color: #a0aec0;
}

:global(.dark-theme) .setting-control select {
  background: #2d3748;
  border-color: #4a5568;
  color: #f7fafc;
}

:global(.dark-theme) .text-input,
:global(.dark-theme) .textarea-input {
  background: #2d3748;
  border-color: #4a5568;
  color: #f7fafc;
}

:global(.dark-theme) .text-input::placeholder,
:global(.dark-theme) .textarea-input::placeholder {
  color: #718096;
}

:global(.dark-theme) .toggle-password {
  color: #a0aec0;
}

:global(.dark-theme) .toggle-password:hover {
  color: #4a6cf7;
}
</style>