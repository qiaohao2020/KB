import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'
import Sidebar from '../../../src/components/Sidebar.vue'

// 模拟localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// 创建测试路由
const routes = [
  { path: '/knowledge', name: 'knowledge', component: { template: '<div>Knowledge</div>' } },
  { path: '/search', name: 'search', component: { template: '<div>Search</div>' } },
  { path: '/chat', name: 'chat', component: { template: '<div>Chat</div>' } },
  { path: '/history', name: 'history', component: { template: '<div>History</div>' } },
  { path: '/settings', name: 'settings', component: { template: '<div>Settings</div>' } },
  { path: '/about', name: 'about', component: { template: '<div>About</div>' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

describe('Sidebar Component with Collapse/Expand', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  it('should render in collapsed state by default', () => {
    // 确保localStorage返回null，使用默认状态
    localStorageMock.getItem.mockReturnValue(null)
    
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.vm.isCollapsed).toBe(true)
    expect(wrapper.find('.sidebar').classes()).toContain('collapsed')
  })

  it('should toggle collapse state when toggle button is clicked', async () => {
    // 确保localStorage返回null，使用默认状态
    localStorageMock.getItem.mockReturnValue(null)
    
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [router]
      }
    })

    const toggleBtn = wrapper.find('.toggle-btn')
    expect(toggleBtn.exists()).toBe(true)

    // 初始状态是收缩的
    expect(wrapper.vm.isCollapsed).toBe(true)

    // 点击展开
    await toggleBtn.trigger('click')
    expect(wrapper.vm.isCollapsed).toBe(false)
    expect(wrapper.find('.sidebar').classes()).not.toContain('collapsed')

    // 再次点击收缩
    await toggleBtn.trigger('click')
    expect(wrapper.vm.isCollapsed).toBe(true)
    expect(wrapper.find('.sidebar').classes()).toContain('collapsed')
  })

  it('should save collapse state to localStorage', async () => {
    // 确保localStorage返回null，使用默认状态
    localStorageMock.getItem.mockReturnValue(null)
    
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [router]
      }
    })

    const toggleBtn = wrapper.find('.toggle-btn')
    
    // 点击切换状态（从收缩true变为展开false）
    await toggleBtn.trigger('click')
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'quicksearch-sidebar-collapsed', 
      'false'
    )
  })

  it('should restore collapse state from localStorage', () => {
    // 模拟localStorage返回展开状态
    localStorageMock.getItem.mockReturnValue('false')

    const wrapper = mount(Sidebar, {
      global: {
        plugins: [router]
      }
    })

    expect(localStorageMock.getItem).toHaveBeenCalledWith('quicksearch-sidebar-collapsed')
    expect(wrapper.vm.isCollapsed).toBe(false)
  })

  it('should emit sidebar-toggle event when toggled', async () => {
    // 确保localStorage返回null，使用默认状态
    localStorageMock.getItem.mockReturnValue(null)
    
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [router]
      }
    })

    const toggleBtn = wrapper.find('.toggle-btn')
    await toggleBtn.trigger('click')

    expect(wrapper.emitted('sidebar-toggle')).toBeTruthy()
    expect(wrapper.emitted('sidebar-toggle')[0]).toEqual([false])
  })

  it('should show correct toggle icon based on state', async () => {
    // 确保localStorage返回null，使用默认状态
    localStorageMock.getItem.mockReturnValue(null)
    
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [router]
      }
    })

    // 收缩状态显示右箭头
    expect(wrapper.find('.toggle-btn i').classes()).toContain('bi-chevron-right')

    // 切换到展开状态
    await wrapper.find('.toggle-btn').trigger('click')
    expect(wrapper.find('.toggle-btn i').classes()).toContain('bi-chevron-left')
  })

  it('should hide text elements when collapsed', () => {
    // 确保localStorage返回null，使用默认状态
    localStorageMock.getItem.mockReturnValue(null)
    
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [router]
      }
    })

    // 在收缩状态下，文本应该被隐藏
    const logoTitle = wrapper.find('.logo h1')
    const navSpans = wrapper.findAll('.nav-item span')

    expect(logoTitle.isVisible()).toBe(false)
    navSpans.forEach(span => {
      expect(span.isVisible()).toBe(false)
    })
  })

  it('should show tooltips for nav items when collapsed', () => {
    // 确保localStorage返回null，使用默认状态
    localStorageMock.getItem.mockReturnValue(null)
    
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [router]
      }
    })

    const navItems = wrapper.findAll('.nav-item')
    
    // 检查是否有title属性用于tooltip
    navItems.forEach((item, index) => {
      const expectedLabel = wrapper.vm.navItems[index].label
      expect(item.attributes('title')).toBe(expectedLabel)
    })
  })

  it('should render all navigation items', () => {
    // 确保localStorage返回null，使用默认状态
    localStorageMock.getItem.mockReturnValue(null)
    
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [router]
      }
    })

    const navItems = wrapper.findAll('.nav-item')
    expect(navItems.length).toBe(6)

    const expectedItems = [
      { label: '知识库', icon: 'bi-book' },
      { label: '内容检索', icon: 'bi-search' },
      { label: '智能问答', icon: 'bi-chat-dots' },
      { label: '历史记录', icon: 'bi-clock-history' },
      { label: '设置', icon: 'bi-gear' },
      { label: '关于', icon: 'bi-info-circle' }
    ]

    expectedItems.forEach((item, index) => {
      const navItem = navItems[index]
      expect(navItem.find('i').classes()).toContain(item.icon)
      expect(navItem.find('span').text()).toBe(item.label)
    })
  })

  it('should have proper CSS classes for collapsed state', () => {
    // 确保localStorage返回null，使用默认状态
    localStorageMock.getItem.mockReturnValue(null)
    
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [router]
      }
    })

    const sidebar = wrapper.find('.sidebar')
    expect(sidebar.classes()).toContain('collapsed')
  })
})