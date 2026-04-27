# 浮动弹框优化更新

## 更新概述

将系统提示词选择器和模型选择器的弹框改为真正的浮动弹框，使用 `Teleport` 组件挂载到 body，并添加智能定位和点击外部关闭功能。

## 主要改进

### 1. 使用 Teleport 组件

**优点**：
- ✅ 弹框挂载到 body，避免父容器 overflow 限制
- ✅ 更高的 z-index 层级（9999）
- ✅ 不受父容器样式影响
- ✅ 更好的定位控制

**实现**：
```vue
<Teleport to="body">
  <div v-if="showDropdown" class="selector-dropdown">
    <!-- 弹框内容 -->
  </div>
</Teleport>
```

### 2. 智能定位系统

**功能**：
- ✅ 自动计算可用空间
- ✅ 向上或向下智能显示
- ✅ 响应窗口大小变化
- ✅ 固定定位（fixed）

**算法**：
```javascript
const calculatePosition = () => {
  const rect = selectorRef.value.getBoundingClientRect()
  const dropdownHeight = 400 // 预估高度
  const spaceAbove = rect.top
  const spaceBelow = window.innerHeight - rect.bottom
  
  // 判断显示方向
  const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow
  
  if (showAbove) {
    // 向上显示
    dropdownStyle.value = {
      position: 'fixed',
      left: `${rect.left}px`,
      bottom: `${window.innerHeight - rect.top + 8}px`,
      minWidth: `${Math.max(rect.width, 280)}px`
    }
  } else {
    // 向下显示
    dropdownStyle.value = {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.bottom + 8}px`,
      minWidth: `${Math.max(rect.width, 280)}px`
    }
  }
}
```

### 3. 点击外部关闭

**功能**：
- ✅ 点击弹框外部自动关闭
- ✅ 点击按钮切换显示/隐藏
- ✅ 选择选项后自动关闭

**实现**：
```javascript
const handleClickOutside = (event) => {
  if (showDropdown.value && 
      selectorRef.value && 
      !selectorRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
```

### 4. 视觉改进

#### SystemPromptSelector（系统提示词）
- ✅ 添加下拉箭头图标
- ✅ 显示当前选中的提示词名称
- ✅ 空状态提示
- ✅ 描述文本支持多行显示
- ✅ 宽度增加到 320px

#### ModelSelector（模型选择）
- ✅ 添加下拉箭头图标
- ✅ 添加模型图标
- ✅ 状态图标（可用/受限/不可用）
- ✅ 空状态提示
- ✅ 宽度增加到 360px
- ✅ 更大的图标容器（36px）

### 5. 动画优化

**新动画**：
```css
@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

**特点**：
- 淡入效果
- 缩放效果（0.95 → 1）
- 上移效果（-10px → 0）
- 时长：0.2s

### 6. 响应式优化

**窗口大小变化**：
```javascript
window.addEventListener('resize', () => {
  if (showDropdown.value) {
    calculatePosition()
  }
})
```

**移动端适配**：
- 最大宽度：90vw
- 自动调整位置
- 触摸友好

## 组件对比

### SystemPromptSelector

| 特性 | 优化前 | 优化后 |
|------|--------|--------|
| 定位方式 | absolute | fixed (Teleport) |
| 显示方向 | 固定向上 | 智能判断 |
| 点击外部 | ❌ | ✅ |
| 窗口调整 | ❌ | ✅ |
| 下拉箭头 | ❌ | ✅ |
| 显示选中 | ❌ | ✅ |
| 空状态 | ❌ | ✅ |
| 宽度 | 280px | 320px |
| z-index | 1000 | 9999 |

### ModelSelector

| 特性 | 优化前 | 优化后 |
|------|--------|--------|
| 定位方式 | absolute | fixed (Teleport) |
| 显示方向 | 固定向上 | 智能判断 |
| 点击外部 | ❌ | ✅ |
| 窗口调整 | ❌ | ✅ |
| 下拉箭头 | ❌ | ✅ |
| 模型图标 | ❌ | ✅ |
| 状态图标 | ❌ | ✅ |
| 空状态 | ❌ | ✅ |
| 宽度 | 280px | 360px |
| z-index | 1000 | 9999 |

## 使用示例

### 基本使用
```vue
<template>
  <SystemPromptSelector
    :prompts="systemPrompts"
    :selected-prompt="selectedPrompt"
    @select="handleSelectPrompt"
    @add="handleAddPrompt"
    @edit="handleEditPrompt"
    @delete="handleDeletePrompt"
  />
  
  <ModelSelector
    :models="availableModels"
    :selected-model="selectedModel"
    @select="handleSelectModel"
  />
</template>
```

### 数据结构

#### 系统提示词
```javascript
{
  id: 1,
  name: '代码助手',
  description: '专业的代码编写和调试助手'
}
```

#### 模型
```javascript
{
  id: 'gpt-4',
  name: 'GPT-4',
  description: '最新的GPT-4模型，性能强大',
  status: 'available',  // available | limited | unavailable
  statusText: '可用'
}
```

## 交互流程

### 打开弹框
1. 用户点击选择器按钮
2. 计算弹框位置
3. 显示弹框（淡入动画）
4. 箭头图标旋转 180°

### 选择选项
1. 用户点击选项
2. 触发 select 事件
3. 自动关闭弹框
4. 更新按钮显示

### 关闭弹框
1. 点击外部区域
2. 或再次点击按钮
3. 或选择选项后
4. 弹框淡出消失

## 技术细节

### Teleport 的作用
```vue
<!-- 组件内部 -->
<div class="selector">
  <button>选择器</button>
  
  <Teleport to="body">
    <!-- 这部分会被传送到 body 下 -->
    <div class="dropdown">...</div>
  </Teleport>
</div>

<!-- 实际 DOM 结构 -->
<body>
  <div id="app">
    <div class="selector">
      <button>选择器</button>
    </div>
  </div>
  
  <!-- Teleport 的内容在这里 -->
  <div class="dropdown">...</div>
</body>
```

### 固定定位的优势
- 不受滚动影响
- 不受父容器限制
- 精确的位置控制
- 更高的层级

### 事件监听清理
```javascript
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
})
```

## 浏览器兼容性

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Teleport | 90+ | 88+ | 14+ | 90+ |
| Fixed定位 | ✅ | ✅ | ✅ | ✅ |
| 事件监听 | ✅ | ✅ | ✅ | ✅ |
| CSS动画 | ✅ | ✅ | ✅ | ✅ |

## 性能优化

### 1. 按需计算
- 只在打开时计算位置
- 窗口调整时重新计算

### 2. 事件委托
- 使用单个全局监听器
- 避免多个监听器

### 3. 动画优化
- 使用 transform 和 opacity
- GPU 加速
- 短时长（0.2s）

## 测试场景

### 场景 1：正常显示
1. 点击系统提示词按钮
2. 弹框向下显示
3. 点击外部关闭

### 场景 2：空间不足
1. 滚动到页面底部
2. 点击模型选择按钮
3. 弹框向上显示

### 场景 3：窗口调整
1. 打开弹框
2. 调整窗口大小
3. 弹框位置自动调整

### 场景 4：选择选项
1. 打开弹框
2. 点击某个选项
3. 弹框自动关闭
4. 按钮显示更新

## 已知问题

### 无

目前没有已知问题。

## 未来改进

- [ ] 添加键盘导航（上下箭头）
- [ ] 添加搜索过滤功能
- [ ] 支持分组显示
- [ ] 添加快捷键支持
- [ ] 支持拖拽排序

---

**更新日期**: 2026-04-27
**版本**: 1.1.0
**状态**: ✅ 已完成
