/**
 * PromptDialog组件测试
 * 测试Prompt对话框的基本功能
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PromptDialog from '../../src/components/PromptDialog.vue'

describe('PromptDialog', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PromptDialog, {
      props: {
        visible: true
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('应该正确渲染组件', () => {
    expect(wrapper.find('.prompt-dialog-overlay').exists()).toBe(true)
    expect(wrapper.find('.prompt-dialog').exists()).toBe(true)
  })

  it('当visible为false时不应该显示对话框', async () => {
    await wrapper.setProps({ visible: false })
    expect(wrapper.find('.prompt-dialog-overlay').exists()).toBe(false)
  })

  it('应该显示正确的标题 - 添加模式', () => {
    expect(wrapper.find('.dialog-header h3').text()).toBe('添加自定义Prompt')
  })

  it('应该显示正确的标题 - 编辑模式', async () => {
    await wrapper.setProps({
      editingPrompt: { id: 1, name: '测试', content: '测试内容' }
    })
    expect(wrapper.find('.dialog-header h3').text()).toBe('编辑自定义Prompt')
  })

  it('应该正确填充编辑数据', async () => {
    const testPrompt = { id: 1, name: '测试Prompt', content: '测试内容' }
    await wrapper.setProps({ editingPrompt: testPrompt })
    
    expect(wrapper.vm.formData.name).toBe('测试Prompt')
    expect(wrapper.vm.formData.content).toBe('测试内容')
  })

  it('表单验证应该正确工作', async () => {
    // 空表单应该无效
    expect(wrapper.vm.isFormValid).toBeFalsy()
    
    // 只有名称应该无效
    wrapper.vm.formData.name = '测试'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isFormValid).toBeFalsy()
    
    // 名称和内容都有应该有效
    wrapper.vm.formData.content = '测试内容'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isFormValid).toBeTruthy()
  })

  it('点击关闭按钮应该触发close事件', async () => {
    const closeBtn = wrapper.find('.close-btn')
    await closeBtn.trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('点击遮罩层应该触发close事件', async () => {
    const overlay = wrapper.find('.prompt-dialog-overlay')
    await overlay.trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('点击对话框内容不应该触发close事件', async () => {
    const dialog = wrapper.find('.prompt-dialog')
    await dialog.trigger('click')
    
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('点击保存按钮应该触发save事件', async () => {
    // 填充表单数据
    wrapper.vm.formData.name = '测试Prompt'
    wrapper.vm.formData.content = '测试内容'
    await wrapper.vm.$nextTick()
    
    const saveBtn = wrapper.find('.btn-primary')
    await saveBtn.trigger('click')
    
    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save')[0][0]).toEqual({
      name: '测试Prompt',
      content: '测试内容'
    })
  })

  it('表单无效时保存按钮应该被禁用', async () => {
    const saveBtn = wrapper.find('.btn-primary')
    expect(saveBtn.attributes('disabled')).toBeDefined()
  })

  it('表单有效时保存按钮应该可用', async () => {
    wrapper.vm.formData.name = '测试'
    wrapper.vm.formData.content = '测试内容'
    await wrapper.vm.$nextTick()
    
    const saveBtn = wrapper.find('.btn-primary')
    expect(saveBtn.attributes('disabled')).toBeUndefined()
  })

  it('Enter键应该触发保存（在输入框中）', async () => {
    wrapper.vm.formData.name = '测试'
    wrapper.vm.formData.content = '测试内容'
    await wrapper.vm.$nextTick()
    
    const nameInput = wrapper.find('.form-input')
    await nameInput.trigger('keydown.enter')
    
    expect(wrapper.emitted('save')).toBeTruthy()
  })

  it('Ctrl+Enter应该触发保存（在文本域中）', async () => {
    wrapper.vm.formData.name = '测试'
    wrapper.vm.formData.content = '测试内容'
    await wrapper.vm.$nextTick()
    
    const textarea = wrapper.find('.form-textarea')
    await textarea.trigger('keydown.ctrl.enter')
    
    expect(wrapper.emitted('save')).toBeTruthy()
  })

  it('应该正确处理取消操作', async () => {
    const cancelBtn = wrapper.find('.btn-secondary')
    await cancelBtn.trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})