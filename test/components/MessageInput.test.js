/**
 * MessageInput组件测试
 * 测试快速开始悬浮框的基本功能（固定显示在右上方）
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MessageInput from '../../src/components/MessageInput.vue'

// Mock DOM methods
const mockQuerySelector = vi.fn()

describe('MessageInput', () => {
  let wrapper

  beforeEach(() => {
    // Reset mocks
    mockQuerySelector.mockReset()
    
    // Mock document.querySelector
    document.querySelector = mockQuerySelector
    
    wrapper = mount(MessageInput, {
      props: {
        prompts: [
          { id: 1, name: '测试Prompt', content: '这是一个测试prompt' }
        ]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('应该正确渲染组件', () => {
    expect(wrapper.find('.chat-input-container').exists()).toBe(true)
    expect(wrapper.find('.prompt-btn').exists()).toBe(true)
  })

  it('点击快速开始按钮应该显示下拉菜单', async () => {
    const promptBtn = wrapper.find('.prompt-btn')
    await promptBtn.trigger('click')
    
    expect(wrapper.vm.showPromptDropdown).toBe(true)
  })

  it('悬浮框应该固定显示在按钮右上方', async () => {
    // Mock dropdown element
    const mockDropdown = {
      classList: {
        remove: vi.fn(),
        add: vi.fn()
      }
    }
    
    mockQuerySelector.mockReturnValueOnce(mockDropdown) // .prompt-dropdown-menu
    
    // 调用重置位置方法
    await wrapper.vm.resetDropdownPosition()
    
    // 验证移除了所有位置调整类，确保使用默认的右上方位置
    expect(mockDropdown.classList.remove).toHaveBeenCalledWith('position-left', 'position-bottom')
    // 验证没有添加任何位置调整类
    expect(mockDropdown.classList.add).not.toHaveBeenCalled()
  })

  it('应该在点击外部时关闭下拉菜单', async () => {
    // 显示下拉菜单
    wrapper.vm.showPromptDropdown = true
    
    // 模拟点击外部
    const event = new Event('click')
    Object.defineProperty(event, 'target', {
      value: document.body
    })
    
    document.dispatchEvent(event)
    
    expect(wrapper.vm.showPromptDropdown).toBe(false)
  })

  it('使用prompt应该填充输入框并关闭菜单', async () => {
    const testPrompt = { id: 1, name: '测试', content: '测试内容' }
    
    await wrapper.vm.usePrompt(testPrompt)
    
    expect(wrapper.vm.inputMessage).toBe('测试内容')
    expect(wrapper.vm.showPromptDropdown).toBe(false)
  })

  it('应该正确处理输入消息', async () => {
    const testMessage = '这是一个测试消息'
    
    // 直接设置输入内容
    wrapper.vm.inputMessage = testMessage
    
    // 验证输入内容
    expect(wrapper.vm.inputMessage).toBe(testMessage)
  })

  it('应该正确清空输入', async () => {
    // 设置输入内容
    wrapper.vm.inputMessage = '测试内容'
    
    // 清空输入
    await wrapper.vm.clearInput()
    
    // 验证输入已清空
    expect(wrapper.vm.inputMessage).toBe('')
  })

  it('应该正确切换输入模式', async () => {
    const initialMode = wrapper.vm.isMultiLine
    
    // 切换输入模式
    await wrapper.vm.toggleInputMode()
    
    // 验证模式已切换
    expect(wrapper.vm.isMultiLine).toBe(!initialMode)
  })

  it('点击切换输入模式按钮应该正常工作', async () => {
    const initialMode = wrapper.vm.isMultiLine
    
    // 找到切换输入模式按钮 - 使用title属性
    const toggleBtn = wrapper.find('button[title="切换输入模式"]')
    expect(toggleBtn.exists()).toBe(true)
    
    // 点击按钮
    await toggleBtn.trigger('click')
    
    // 验证模式已切换
    expect(wrapper.vm.isMultiLine).toBe(!initialMode)
  })

  it('切换到单行模式时应该设置最小高度', async () => {
    // 设置一个较大的初始高度
    wrapper.vm.inputHeight = 150
    wrapper.vm.isMultiLine = true
    
    // 切换到单行模式
    await wrapper.vm.toggleInputMode()
    
    // 验证切换到单行模式时高度变为最小高度
    expect(wrapper.vm.isMultiLine).toBe(false)
    expect(wrapper.vm.inputHeight).toBe(80) // minHeight
  })

  it('切换到多行模式时应该保持当前高度', async () => {
    // 设置单行模式和最小高度
    wrapper.vm.isMultiLine = false
    wrapper.vm.inputHeight = 80
    
    // 切换到多行模式
    await wrapper.vm.toggleInputMode()
    
    // 验证切换到多行模式时保持当前高度（不自动调整）
    expect(wrapper.vm.isMultiLine).toBe(true)
    expect(wrapper.vm.inputHeight).toBe(80) // 保持原高度
  })

  it('使用prompt时应该保持当前高度', async () => {
    // 设置一个初始高度
    wrapper.vm.inputHeight = 150
    const initialHeight = wrapper.vm.inputHeight
    
    // 使用prompt
    const testPrompt = { id: 1, name: '测试prompt', content: '测试内容' }
    await wrapper.vm.usePrompt(testPrompt)
    
    // 验证高度保持不变
    expect(wrapper.vm.inputHeight).toBe(initialHeight)
    expect(wrapper.vm.inputMessage).toBe('测试内容')
  })

  it('发送消息后应该保持当前高度', async () => {
    // 确保是多行模式
    wrapper.vm.isMultiLine = true
    
    // 设置输入内容和高度
    wrapper.vm.inputMessage = '测试消息'
    wrapper.vm.inputHeight = 150
    const initialHeight = wrapper.vm.inputHeight
    
    // 发送消息
    await wrapper.vm.handleSendMessage()
    
    // 验证高度保持不变，内容被清空
    expect(wrapper.vm.inputHeight).toBe(initialHeight)
    expect(wrapper.vm.inputMessage).toBe('')
  })

  it('清空输入后应该保持当前高度', async () => {
    // 确保是多行模式
    wrapper.vm.isMultiLine = true
    
    // 设置输入内容和高度
    wrapper.vm.inputMessage = '测试内容'
    wrapper.vm.inputHeight = 150
    const initialHeight = wrapper.vm.inputHeight
    
    // 清空输入
    await wrapper.vm.clearInput()
    
    // 验证高度保持不变，内容被清空
    expect(wrapper.vm.inputHeight).toBe(initialHeight)
    expect(wrapper.vm.inputMessage).toBe('')
  })
})