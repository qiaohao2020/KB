# QuickSearch 组件测试指南

## 概述

这是一个用于测试QuickSearch浏览器插件项目组件的Web测试页面。

## 快速开始

### 方法1: 使用开发服务器（推荐）

```bash
npm run dev
```

然后在浏览器中访问: `http://localhost:5173/test-page.html`

### 方法2: 直接打开HTML文件

由于使用了ES模块，需要通过HTTP服务器访问。可以使用以下任一方式：

**使用Python:**
```bash
# Python 3
python -m http.server 8000

# 然后访问: http://localhost:8000/test-page.html
```

**使用Node.js (http-server):**
```bash
npx http-server -p 8000

# 然后访问: http://localhost:8000/test-page.html
```

**使用VS Code Live Server插件:**
1. 安装 Live Server 插件
2. 右键点击 `test-page.html`
3. 选择 "Open with Live Server"

## 测试内容

### 1. MessageInput 组件
- ✅ 消息输入框
- ✅ 手动拖拽调整高度
- ✅ 系统提示词选择器
- ✅ 模型选择器
- ✅ 字数统计
- ✅ 发送按钮

### 2. SystemPromptSelector 组件
- ✅ 系统提示词列表
- ✅ 添加提示词
- ✅ 编辑提示词
- ✅ 删除提示词
- ✅ 下拉菜单交互

### 3. ModelSelector 组件
- ✅ 模型列表显示
- ✅ 模型状态标识（可用/受限/不可用）
- ✅ 模型切换
- ✅ 下拉菜单交互

### 4. 完整布局测试
- ✅ 聊天消息显示
- ✅ 消息输入
- ✅ 完整交互流程

## 功能特性

### 组件独立性
- 每个组件都可以独立测试
- 组件之间互不干扰
- 支持热重载

### 交互测试
- 实时事件日志
- 状态变化展示
- 用户操作反馈

### 响应式设计
- 支持桌面端
- 支持移动端
- 自适应布局

## 测试步骤

1. **启动测试页面**
   - 使用上述任一方法启动HTTP服务器
   - 在浏览器中打开测试页面

2. **选择测试组件**
   - 点击对应的"测试组件"按钮
   - 组件将加载到预览区域

3. **进行交互测试**
   - 测试各种用户操作
   - 观察组件行为
   - 查看事件日志

4. **验证功能**
   - 确认所有功能正常工作
   - 检查样式是否正确
   - 测试边界情况

## 常见问题

### Q: 页面显示空白？
A: 确保通过HTTP服务器访问，不能直接用file://协议打开。

### Q: 组件加载失败？
A: 检查是否正确安装了依赖: `npm install`

### Q: 样式显示异常？
A: 确保Bootstrap Icons CDN链接可访问。

### Q: 如何调试？
A: 打开浏览器开发者工具(F12)查看控制台日志。

## 项目结构

```
quicksearch-browser-extension/
├── src/
│   ├── components/
│   │   ├── MessageInput.vue          # 消息输入组件
│   │   ├── SystemPromptSelector.vue  # 系统提示词选择器
│   │   └── ModelSelector.vue         # 模型选择器
│   └── ...
├── test-page.html                     # 测试页面
├── TEST_GUIDE.md                      # 本文档
└── package.json
```

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vite** - 下一代前端构建工具
- **Bootstrap Icons** - 图标库
- **ES Modules** - 现代JavaScript模块系统

## 开发建议

1. **组件开发**
   - 先在测试页面中开发和调试组件
   - 确认功能正常后再集成到主应用

2. **样式调整**
   - 使用浏览器开发者工具实时调整样式
   - 测试不同屏幕尺寸的显示效果

3. **交互测试**
   - 测试所有用户交互场景
   - 验证边界情况和错误处理

4. **性能优化**
   - 检查组件渲染性能
   - 优化事件处理逻辑

## 更新日志

### v1.0.0 (2025-10-22)
- ✨ 初始版本
- ✅ MessageInput组件测试
- ✅ SystemPromptSelector组件测试
- ✅ ModelSelector组件测试
- ✅ 完整布局测试
- ✅ 响应式设计支持

## 贡献

欢迎提交问题和改进建议！

## 许可证

MIT License
