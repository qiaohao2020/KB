import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryTree from '../../src/components/CategoryTree.vue'

describe('CategoryTree', () => {
  let wrapper

  const mockCategories = [
    {
      id: 1,
      name: '产品文档',
      children: [
        { id: 11, name: '用户手册' }
      ]
    }
  ]

  beforeEach(() => {
    localStorage.clear()
    
    wrapper = mount(CategoryTree, {
      props: {
        categories: mockCategories,
        selectedCategory: ''
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('应该正确渲染组件', () => {
    expect(wrapper.find('.category-tree').exists()).toBe(true)
    expect(wrapper.find('.tree-header').exists()).toBe(true)
    expect(wrapper.find('.tree-content').exists()).toBe(true)
  })

  it('应该显示拖拽调整手柄', () => {
    expect(wrapper.find('.resize-handle').exists()).toBe(true)
  })

  it('应该有默认宽度', () => {
    expect(wrapper.vm.treeWidth).toBe(250)
  })

  it('应该支持折叠功能', async () => {
    expect(wrapper.vm.isCollapsed).toBe(false)
    
    const collapseBtn = wrapper.find('.btn-icon')
    await collapseBtn.trigger('click')
    
    expect(wrapper.vm.isCollapsed).toBe(true)
  })

  it('点击分类应该触发选择事件', async () => {
    const categoryHeader = wrapper.find('.category-header')
    await categoryHeader.trigger('click')
    
    expect(wrapper.emitted('category-selected')).toBeTruthy()
  })
})