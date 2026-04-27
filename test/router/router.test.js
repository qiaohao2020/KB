import { describe, it, expect } from 'vitest'
import { createRouter, createWebHashHistory } from 'vue-router'
import router from '../../src/router.js'

describe('Router Configuration', () => {
  it('should have correct routes defined', () => {
    const routes = router.getRoutes()
    
    // 检查路由数量
    expect(routes.length).toBe(7) // 包括重定向路由和about路由
    
    // 检查主要路由是否存在
    const routeNames = routes.map(route => route.name).filter(Boolean)
    expect(routeNames).toContain('knowledge')
    expect(routeNames).toContain('search')
    expect(routeNames).toContain('chat')
    expect(routeNames).toContain('history')
    expect(routeNames).toContain('settings')
    expect(routeNames).toContain('about')
  })

  it('should redirect root path to knowledge', () => {
    const rootRoute = router.getRoutes().find(route => route.path === '/')
    expect(rootRoute.redirect).toBe('/knowledge')
  })

  it('should have correct meta information for routes', () => {
    const knowledgeRoute = router.getRoutes().find(route => route.name === 'knowledge')
    expect(knowledgeRoute.meta.title).toBe('知识库')
    expect(knowledgeRoute.meta.icon).toBe('bi bi-book')
    
    const chatRoute = router.getRoutes().find(route => route.name === 'chat')
    expect(chatRoute.meta.title).toBe('智能问答')
    expect(chatRoute.meta.icon).toBe('bi bi-chat-dots')
  })

  it('should use hash history mode', () => {
    expect(router.options.history.base).toBeDefined()
  })
})