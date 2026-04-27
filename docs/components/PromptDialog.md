# PromptDialog 组件

PromptDialog 是一个独立的对话框组件，用于添加和编辑自定义 Prompt。

## 功能特性

- ✅ 支持添加和编辑模式
- ✅ 表单验证和错误处理
- ✅ 键盘快捷键支持
- ✅ 响应式设计
- ✅ 优雅的动画效果
- ✅ 可访问性支持

## 使用方法

### 基本用法

```vue
<template>
  <PromptDialog 
    :visible="showDialog"
    :editing-prompt="editingPrompt"
    @close="handleClose"
    @save="handleSave"
  />
</template>

<script>
import PromptDialog from '@/components/PromptDialog.vue'

export default {
  components: {
    PromptDialog
  },
  data() {
    return {
      showDialog: false,
      editingPrompt: null
    }
  },
  methods: {
    handleClose() {
      this.showDialog = false
      this.editingPrompt = null
    },
    
    handleSave(promptData) {
      console.log('保存 Prompt:', promptData)
      // 处理保存逻辑
      this.handleClose()
    }
  }
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `visible` | Boolean | `false` | 控制对话框显示/隐藏 |
| `editingPrompt` | Object | `null` | 编辑的 Prompt 对象，为 null 时为添加模式 |

### editingPrompt 对象结构

```javascript
{
  id: Number,        // Prompt ID
  name: String,      // Prompt 名称
  content: String,   // Prompt 内容
  isDefault: Boolean // 是否为默认 Prompt
}
```

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `close` | - | 关闭对话框时触发 |
| `save` | `promptData` | 保存 Prompt 时触发 |

### save 事件参数

```javascript
{
  name: String,    // Prompt 名称（已去除首尾空格）
  content: String  // Prompt 内容（已去除首尾空格）
}
```

## 键盘快捷键

- **Enter**: 在名称输入框中按 Enter 键保存
- **Ctrl+Enter**: 在内容文本域中按 Ctrl+Enter 保存
- **Escape**: 关闭对话框（需要在父组件中实现）

## 表单验证

组件内置表单验证逻辑：

- 名称和内容都不能为空
- 自动去除首尾空格
- 保存按钮在表单无效时自动禁用

## 样式特性

### 动画效果

- 遮罩层淡入动画
- 对话框滑入和缩放动画
- 按钮悬停效果

### 响应式设计

- 桌面端：固定宽度，居中显示
- 移动端：全宽显示，按钮垂直排列
- 防止 iOS 输入框缩放

### 暗色模式支持

组件支持系统暗色模式，会自动适配颜色主题。

## 可访问性

- 支持键盘导航
- 适当的焦点管理
- 语义化的 HTML 结构

## 使用示例

### 添加新 Prompt

```javascript
// 显示添加对话框
this.editingPrompt = null
this.showDialog = true
```

### 编辑现有 Prompt

```javascript
// 显示编辑对话框
this.editingPrompt = {
  id: 1,
  name: '代码解释',
  content: '请帮我解释这段代码...',
  isDefault: false
}
this.showDialog = true
```

### 处理保存事件

```javascript
handleSave(promptData) {
  if (this.editingPrompt) {
    // 编辑模式：更新现有 Prompt
    const index = this.prompts.findIndex(p => p.id === this.editingPrompt.id)
    if (index !== -1) {
      this.prompts[index] = {
        ...this.prompts[index],
        name: promptData.name,
        content: promptData.content
      }
    }
  } else {
    // 添加模式：创建新 Prompt
    const newPrompt = {
      id: Date.now(),
      name: promptData.name,
      content: promptData.content,
      isDefault: false
    }
    this.prompts.push(newPrompt)
  }
  
  // 关闭对话框
  this.handleClose()
}
```

## 注意事项

1. **数据绑定**: 组件内部管理表单数据，不会直接修改 props
2. **事件处理**: 所有用户操作都通过事件向父组件通信
3. **样式隔离**: 使用 scoped 样式，不会影响其他组件
4. **性能优化**: 使用计算属性进行表单验证，避免不必要的重新计算

## 测试覆盖

组件包含完整的单元测试，覆盖：

- 基本渲染
- 属性响应
- 事件触发
- 表单验证
- 键盘交互
- 用户操作

测试文件：`test/components/PromptDialog.test.js`