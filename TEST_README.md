# 🧪 QuickSearch 组件测试页面

一个用于测试和演示QuickSearch浏览器插件项目组件的独立Web页面。

## 🚀 快速启动

### 方式1: 使用npm脚本（推荐）

```bash
npm run test:ui
```

这将自动启动开发服务器并在浏览器中打开测试页面。

### 方式2: 使用启动脚本

**Windows:**
```bash
start-test.bat
```

**Linux/Mac:**
```bash
chmod +x start-test.sh
./start-test.sh
```

### 方式3: 手动启动

```bash
npm run dev
```

然后在浏览器中访问: `http://localhost:5173/test-page.html`

## 📦 测试的组件

### 1. 💬 MessageInput
完整的消息输入组件，包含：
- 文本输入框（支持多行）
- 手动拖拽调整高度
- 系统提示词选择器
- AI模型选择器
- 字数统计
- 发送按钮

### 2. 🤖 SystemPromptSelector
系统提示词选择器，支持：
- 浏览提示词列表
- 添加新提示词
- 编辑现有提示词
- 删除提示词
- 下拉菜单交互

### 3. 🖥️ ModelSelector
AI模型选择器，功能包括：
- 显示可用模型列表
- 模型状态标识（可用/受限/不可用）
- 快速切换模型
- 模型描述展示

### 4. 📱 完整布局
完整的聊天界面布局测试：
- 消息历史显示
- 实时消息发送
- 完整交互流程

## 🎯 功能特性

### ✨ 实时预览
- 所有组件都可以实时交互
- 即时查看组件行为
- 事件日志记录

### 🎨 美观界面
- 现代化设计
- 渐变背景
- 流畅动画
- 响应式布局

### 🔧 开发友好
- 独立组件测试
- 清晰的事件日志
- 易于调试
- 热重载支持

## 📖 使用说明

1. **启动测试页面**
   ```bash
   npm run test:ui
   ```

2. **选择要测试的组件**
   - 点击对应组件卡片上的"测试组件"按钮
   - 组件将加载到预览区域

3. **进行交互测试**
   - 输入文本
   - 点击按钮
   - 选择选项
   - 观察行为

4. **查看事件日志**
   - MessageInput组件会显示事件日志
   - 可以看到所有触发的事件

## 🛠️ 技术细节

### 技术栈
- **Vue 3** - Composition API
- **Vite** - 快速开发服务器
- **Bootstrap Icons** - 图标库
- **ES Modules** - 模块化

### 组件通信
```javascript
// 事件发射
emit('send-message', message)
emit('select-system-prompt', prompt)
emit('select-model', model)

// 事件监听
@send-message="handleSendMessage"
@select-system-prompt="handleSelectSystemPrompt"
@select-model="handleSelectModel"
```

### Props传递
```javascript
// MessageInput
:is-loading="isLoading"
:system-prompts="systemPrompts"
:available-models="availableModels"
:selected-system-prompt="selectedSystemPrompt"
:selected-model="selectedModel"
```

## 🎨 自定义样式

测试页面使用了自定义样式，主要特点：

- **渐变背景**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **卡片阴影**: `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)`
- **悬停效果**: `transform: translateY(-4px)`
- **圆角设计**: `border-radius: 16px`

## 📱 响应式设计

测试页面支持多种屏幕尺寸：

- **桌面端**: 1400px+ (网格布局)
- **平板端**: 768px-1400px (自适应网格)
- **移动端**: <768px (单列布局)

## 🐛 调试技巧

### 1. 使用浏览器开发者工具
```
F12 或 Ctrl+Shift+I (Windows/Linux)
Cmd+Option+I (Mac)
```

### 2. 查看控制台日志
所有事件都会在控制台输出：
```javascript
console.log('选择提示词:', prompt)
console.log('选择模型:', model)
```

### 3. Vue DevTools
安装Vue DevTools浏览器插件以获得更好的调试体验。

## 📝 测试清单

### MessageInput组件
- [ ] 输入文本
- [ ] 拖拽调整高度
- [ ] 选择系统提示词
- [ ] 选择AI模型
- [ ] 发送消息
- [ ] 查看字数统计
- [ ] 测试快捷键 (Ctrl+Enter)

### SystemPromptSelector组件
- [ ] 打开下拉菜单
- [ ] 选择提示词
- [ ] 点击添加按钮
- [ ] 点击编辑按钮
- [ ] 点击删除按钮
- [ ] 点击外部关闭菜单

### ModelSelector组件
- [ ] 打开下拉菜单
- [ ] 选择模型
- [ ] 查看模型状态
- [ ] 点击外部关闭菜单

### 完整布局
- [ ] 查看消息历史
- [ ] 发送新消息
- [ ] 接收模拟回复
- [ ] 测试加载状态

## 🔗 相关文件

- `test-page.html` - 测试页面主文件
- `TEST_GUIDE.md` - 详细测试指南
- `start-test.bat` - Windows启动脚本
- `start-test.sh` - Linux/Mac启动脚本

## 💡 提示

1. **首次运行**: 确保已安装依赖 `npm install`
2. **端口占用**: 如果5173端口被占用，Vite会自动使用下一个可用端口
3. **热重载**: 修改组件代码后会自动刷新
4. **浏览器兼容**: 推荐使用Chrome、Firefox或Edge最新版本

## 🤝 贡献

发现问题或有改进建议？欢迎提交Issue或Pull Request！

## 📄 许可证

MIT License

---

**Happy Testing! 🎉**
