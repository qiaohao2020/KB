import { describe, it, expect, beforeEach } from 'vitest'
import { AIConfigManager, getAvailableModels, getDefaultSystemPrompts } from '../../src/assets/js/aiConfig.js'

describe('AIConfigManager', () => {
  let settings
  let aiConfig

  beforeEach(() => {
    settings = {
      aiProvider: 'openai',
      apiBaseUrl: '',
      apiKey: 'test-api-key',
      defaultModel: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 4000,
      systemPrompt: 'You are a helpful assistant.',
      azureApiVersion: '2024-02-15-preview'
    }
    aiConfig = new AIConfigManager(settings)
  })

  describe('getApiConfig', () => {
    it('should return correct API configuration', () => {
      const config = aiConfig.getApiConfig()
      
      expect(config.provider).toBe('openai')
      expect(config.apiKey).toBe('test-api-key')
      expect(config.model).toBe('gpt-4o-mini')
      expect(config.temperature).toBe(0.7)
      expect(config.maxTokens).toBe(4000)
    })

    it('should use default URL when apiBaseUrl is empty', () => {
      const config = aiConfig.getApiConfig()
      expect(config.baseUrl).toBe('https://api.openai.com/v1')
    })

    it('should use custom URL when provided', () => {
      settings.apiBaseUrl = 'https://custom-api.example.com'
      const config = aiConfig.getApiConfig()
      expect(config.baseUrl).toBe('https://custom-api.example.com')
    })
  })

  describe('buildHeaders', () => {
    it('should build correct headers for OpenAI', () => {
      const headers = aiConfig.buildHeaders()
      
      expect(headers['Content-Type']).toBe('application/json')
      expect(headers['Authorization']).toBe('Bearer test-api-key')
    })

    it('should build correct headers for Anthropic', () => {
      settings.aiProvider = 'anthropic'
      const headers = aiConfig.buildHeaders()
      
      expect(headers['Content-Type']).toBe('application/json')
      expect(headers['x-api-key']).toBe('test-api-key')
      expect(headers['anthropic-version']).toBe('2023-06-01')
    })

    it('should build correct headers for Azure', () => {
      settings.aiProvider = 'azure'
      const headers = aiConfig.buildHeaders()
      
      expect(headers['Content-Type']).toBe('application/json')
      expect(headers['api-key']).toBe('test-api-key')
    })
  })

  describe('getChatEndpoint', () => {
    it('should return correct endpoint for OpenAI', () => {
      const endpoint = aiConfig.getChatEndpoint()
      expect(endpoint).toBe('https://api.openai.com/v1/chat/completions')
    })

    it('should return correct endpoint for Anthropic', () => {
      settings.aiProvider = 'anthropic'
      settings.apiBaseUrl = 'https://api.anthropic.com'
      const endpoint = aiConfig.getChatEndpoint()
      expect(endpoint).toBe('https://api.anthropic.com/v1/messages')
    })

    it('should return correct endpoint for Azure', () => {
      settings.aiProvider = 'azure'
      settings.apiBaseUrl = 'https://test.openai.azure.com'
      const endpoint = aiConfig.getChatEndpoint()
      expect(endpoint).toBe('https://test.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-02-15-preview')
    })
  })

  describe('buildChatRequest', () => {
    it('should build correct request for OpenAI', () => {
      const messages = [{ role: 'user', content: 'Hello' }]
      const request = aiConfig.buildChatRequest(messages)
      
      expect(request.model).toBe('gpt-4o-mini')
      expect(request.temperature).toBe(0.7)
      expect(request.max_tokens).toBe(4000)
      expect(request.messages).toHaveLength(2) // system + user message
      expect(request.messages[0].role).toBe('system')
      expect(request.messages[1].role).toBe('user')
    })

    it('should build correct request for Anthropic', () => {
      settings.aiProvider = 'anthropic'
      const messages = [{ role: 'user', content: 'Hello' }]
      const request = aiConfig.buildChatRequest(messages)
      
      expect(request.model).toBe('gpt-4o-mini')
      expect(request.temperature).toBe(0.7)
      expect(request.max_tokens).toBe(4000)
      expect(request.system).toBe('You are a helpful assistant.')
      expect(request.messages).toHaveLength(1) // only user message
    })
  })

  describe('validateConfig', () => {
    it('should validate correct configuration', () => {
      const validation = aiConfig.validateConfig()
      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should detect missing API key', () => {
      settings.apiKey = ''
      const validation = aiConfig.validateConfig()
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('请配置API Key')
    })

    it('should detect invalid temperature', () => {
      settings.temperature = 3
      const validation = aiConfig.validateConfig()
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('温度设置必须在0-2之间')
    })

    it('should detect invalid max tokens', () => {
      settings.maxTokens = 50000
      const validation = aiConfig.validateConfig()
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('最大Token数必须在1-32000之间')
    })
  })

  describe('formatMessages', () => {
    it('should format messages correctly', () => {
      const messages = [
        { role: 'user', content: 'Hello' },
        { text: 'Hi there' }, // legacy format
        { role: 'assistant', content: 'How can I help?' }
      ]
      
      const formatted = aiConfig.formatMessages(messages)
      
      expect(formatted).toHaveLength(3)
      expect(formatted[0]).toEqual({ role: 'user', content: 'Hello' })
      expect(formatted[1]).toEqual({ role: 'user', content: 'Hi there' })
      expect(formatted[2]).toEqual({ role: 'assistant', content: 'How can I help?' })
    })
  })
})

describe('getAvailableModels', () => {
  it('should return OpenAI models', () => {
    const models = getAvailableModels('openai')
    expect(models).toHaveLength(4)
    expect(models[0].value).toBe('gpt-4o')
    expect(models[0].label).toBe('GPT-4o')
  })

  it('should return Anthropic models', () => {
    const models = getAvailableModels('anthropic')
    expect(models).toHaveLength(3)
    expect(models[0].value).toBe('claude-3-5-sonnet-20241022')
  })

  it('should return Azure models', () => {
    const models = getAvailableModels('azure')
    expect(models).toHaveLength(2)
    expect(models[0].value).toBe('gpt-4')
  })

  it('should return empty array for unknown provider', () => {
    const models = getAvailableModels('unknown')
    expect(models).toHaveLength(0)
  })
})

describe('getDefaultSystemPrompts', () => {
  it('should return default system prompts', () => {
    const prompts = getDefaultSystemPrompts()
    
    expect(prompts.general).toBeDefined()
    expect(prompts.coding).toBeDefined()
    expect(prompts.writing).toBeDefined()
    expect(prompts.analysis).toBeDefined()
    
    expect(typeof prompts.general).toBe('string')
    expect(prompts.general.length).toBeGreaterThan(0)
  })
})