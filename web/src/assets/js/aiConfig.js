/**
 * AI配置工具类
 * 处理不同AI提供商的配置和API调用
 */

export class AIConfigManager {
  constructor(settings) {
    this.settings = settings
  }

  /**
   * 获取API配置
   */
  getApiConfig() {
    const baseUrl = this.settings.apiBaseUrl || this.getDefaultApiUrl()
    
    return {
      provider: this.settings.aiProvider,
      baseUrl: baseUrl,
      apiKey: this.settings.apiKey,
      model: this.settings.defaultModel,
      temperature: parseFloat(this.settings.temperature),
      maxTokens: parseInt(this.settings.maxTokens),
      systemPrompt: this.settings.systemPrompt,
      azureApiVersion: this.settings.azureApiVersion
    }
  }

  /**
   * 获取默认API URL
   */
  getDefaultApiUrl() {
    const urls = {
      openai: 'https://api.openai.com/v1',
      anthropic: 'https://api.anthropic.com',
      azure: 'https://your-resource.openai.azure.com',
      custom: ''
    }
    return urls[this.settings.aiProvider] || ''
  }

  /**
   * 构建请求头
   */
  buildHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    }

    switch (this.settings.aiProvider) {
      case 'openai':
        headers['Authorization'] = `Bearer ${this.settings.apiKey}`
        break
      case 'anthropic':
        headers['x-api-key'] = this.settings.apiKey
        headers['anthropic-version'] = '2023-06-01'
        break
      case 'azure':
        headers['api-key'] = this.settings.apiKey
        break
      default:
        headers['Authorization'] = `Bearer ${this.settings.apiKey}`
    }

    return headers
  }

  /**
   * 构建聊天请求体
   */
  buildChatRequest(messages) {
    const config = this.getApiConfig()
    
    const baseRequest = {
      model: config.model,
      messages: this.formatMessages(messages),
      temperature: config.temperature,
      max_tokens: config.maxTokens
    }

    // 添加系统提示词
    if (config.systemPrompt && config.provider !== 'anthropic') {
      baseRequest.messages.unshift({
        role: 'system',
        content: config.systemPrompt
      })
    }

    // Anthropic Claude 特殊处理
    if (config.provider === 'anthropic') {
      return {
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        system: config.systemPrompt,
        messages: baseRequest.messages.filter(msg => msg.role !== 'system')
      }
    }

    return baseRequest
  }

  /**
   * 格式化消息
   */
  formatMessages(messages) {
    return messages.map(msg => ({
      role: msg.role || 'user',
      content: msg.content || msg.text || ''
    }))
  }

  /**
   * 获取聊天API端点
   */
  getChatEndpoint() {
    const config = this.getApiConfig()
    
    switch (config.provider) {
      case 'openai':
        return `${config.baseUrl}/chat/completions`
      case 'anthropic':
        return `${config.baseUrl}/v1/messages`
      case 'azure':
        return `${config.baseUrl}/openai/deployments/${config.model}/chat/completions?api-version=${config.azureApiVersion}`
      default:
        return `${config.baseUrl}/chat/completions`
    }
  }

  /**
   * 发送聊天请求
   */
  async sendChatRequest(messages) {
    const config = this.getApiConfig()
    
    if (!config.apiKey) {
      throw new Error('API Key未配置')
    }

    const endpoint = this.getChatEndpoint()
    const headers = this.buildHeaders()
    const body = this.buildChatRequest(messages)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API请求失败: ${response.status} ${response.statusText} - ${errorData.error?.message || ''}`)
      }

      const data = await response.json()
      return this.parseResponse(data)
    } catch (error) {
      console.error('AI API请求失败:', error)
      throw error
    }
  }

  /**
   * 解析API响应
   */
  parseResponse(data) {
    const config = this.getApiConfig()
    
    switch (config.provider) {
      case 'openai':
      case 'azure':
        return {
          content: data.choices?.[0]?.message?.content || '',
          usage: data.usage,
          model: data.model
        }
      case 'anthropic':
        return {
          content: data.content?.[0]?.text || '',
          usage: data.usage,
          model: data.model
        }
      default:
        return {
          content: data.choices?.[0]?.message?.content || data.content || '',
          usage: data.usage,
          model: data.model
        }
    }
  }

  /**
   * 测试API连接
   */
  async testConnection() {
    const config = this.getApiConfig()
    
    if (!config.apiKey) {
      throw new Error('API Key未配置')
    }

    try {
      // 发送一个简单的测试消息
      const testMessages = [
        { role: 'user', content: 'Hello' }
      ]
      
      const result = await this.sendChatRequest(testMessages)
      return {
        success: true,
        message: '连接测试成功',
        response: result.content.substring(0, 100) + (result.content.length > 100 ? '...' : '')
      }
    } catch (error) {
      return {
        success: false,
        message: `连接测试失败: ${error.message}`,
        error: error
      }
    }
  }

  /**
   * 验证配置
   */
  validateConfig() {
    const errors = []
    
    if (!this.settings.aiProvider) {
      errors.push('请选择AI提供商')
    }
    
    if (!this.settings.apiKey) {
      errors.push('请配置API Key')
    }
    
    if (!this.settings.defaultModel) {
      errors.push('请选择默认模型')
    }
    
    if (this.settings.temperature < 0 || this.settings.temperature > 2) {
      errors.push('温度设置必须在0-2之间')
    }
    
    if (this.settings.maxTokens < 1 || this.settings.maxTokens > 32000) {
      errors.push('最大Token数必须在1-32000之间')
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    }
  }
}

/**
 * 获取可用的模型列表
 */
export function getAvailableModels(provider) {
  const models = {
    openai: [
      { value: 'gpt-4o', label: 'GPT-4o', description: '最新的GPT-4模型' },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini', description: '轻量级GPT-4模型' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: '高性能GPT-4模型' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: '经济实用的模型' }
    ],
    anthropic: [
      { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', description: '最新的Claude模型' },
      { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus', description: '最强大的Claude模型' },
      { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku', description: '快速响应的Claude模型' }
    ],
    azure: [
      { value: 'gpt-4', label: 'GPT-4', description: 'Azure GPT-4' },
      { value: 'gpt-35-turbo', label: 'GPT-3.5 Turbo', description: 'Azure GPT-3.5 Turbo' }
    ]
  }
  
  return models[provider] || []
}

/**
 * 获取默认系统提示词
 */
export function getDefaultSystemPrompts() {
  return {
    general: '你是一个有用的AI助手，能够帮助用户解答问题、处理任务和提供建议。请用简洁、准确、友好的方式回复用户。',
    coding: '你是一个专业的编程助手，擅长多种编程语言和技术。请提供准确的代码示例和技术建议。',
    writing: '你是一个专业的写作助手，能够帮助用户改进文本、纠正语法、优化表达。请提供建设性的建议。',
    analysis: '你是一个数据分析专家，能够帮助用户理解数据、发现模式、得出结论。请提供清晰的分析和见解。'
  }
}