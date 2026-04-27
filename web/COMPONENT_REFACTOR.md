# 组件重构说明

## 更新概述

创建了公共的 `FloatingDropdown` 组件，并重构了 `SystemPromptSelector` 和 `ModelSelector` 来使用这个公共组件。同时修复了切换输入模式的图标显示问题。

## 1. FloatingDropdown 公共组件

### 功能特性

- ✅ 通用的浮动弹框容器
- ✅ 智能定位（自动判断向上或向下）
- ✅ 点击外部自动关闭
- ✅ 响应窗口大小和滚动
- ✅ 使用 Teleport 挂载到 body
- ✅ 支持自定义宽度和高度
- ✅ 支持 v-model 双向绑定
- ✅ 灵活的插槽系统

### 组件 API

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | String/Number | 320 | 弹框宽度 |
| maxHeight | String/Number | 400 | 最大高度 |
| disabled | Boolean | false | 是否禁用 |
| dropdownClass | String | '' | 自定义类名 |
| offset | Number | 8 | 偏移量（px） |
| modelValue | Boolean | undefined | v-model 绑定值 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | Boolean | v-model 更新 |
| open | - | 弹框打开时触发 |
| close | - | 弹框关闭时触发 |

#### Slots

| 插槽 | 作用域 | 说明 |
|------|--------|------|
| trigger | { toggle, isOpen } | 触发按钮 |
| trigger-content | - | 触发按钮内容（默认） |
| dropdown | { close } | 弹框内容 |

### 使用示例

#### 基本用法

```vue
<template>
  <FloatingDropdown :width="320">
    <template #trigger="{ toggle, isOpen }">
      <button @click="toggle">
        点击打开
        <i :class="isOpen ? 'rotate' : ''"></i>
      </button>
    </template>
    
    <template #dropdown="{ close }">
      <div class="dropdown-content">
        <div @click="handleSelect(); close()">
          选项 1
        </div>
      </div>
    </template>
  </FloatingDropdown>
</template>
```

#### 使用 v-model

```vue
<template>
  <FloatingDropdown v-model="showDropdown" :width="360">
    <template #trigger>
      <button>自定义触发器</button>
    </template>
    
    <template #dropdown>
      <div>弹框内容</div>
    </template>
  </FloatingDropdown>
</template>

<script setup>
import { ref } from 'vue'
const showDropdown = ref(false)
</script>
```

### 核心实现

#### 智能定位算法

```javascript
const calculatePosition = () => {
  const rect = triggerRef.value.getBoundingClientRect()
  const dropdownHeight = typeof props.maxHeight === 'number' 
    ? props.maxHeight 
    : parseInt(props.maxHeight)
  const spaceAbove = rect.top
  const spaceBelow = window.innerHeight - rect.bottom
  
  // 判断显示方向
  const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow
  
  if (showAbove) {
    // 向上显示
    dropdownStyle.value = {
      position: 'fixed',
      left: `${rect.left}px`,
      bottom: `${window.innerHeight - rect.top + props.offset}px`,
      width: width,
      minWidth: `${Math.max(rect.width, 200)}px`,
      maxWidth: '90vw'
    }
  } else {
    // 向下显示
    dropdownStyle.value = {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.bottom + props.offset}px`,
      width: width,
      minWidth: `${Math.max(rect.width, 200)}px`,
      maxWidth: '90vw'
    }
  }
}
```

#### 事件监听

```javascript
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleResize, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleResize, true)
})
```

## 2. SystemPromptSelector 重构

### 变化对比

#### 重构前
- 自己实现定位逻辑
- 自己管理事件监听
- 代码量：~150 行

#### 重构后
- 使用 FloatingDropdown 组件
- 只关注业务逻辑
- 代码量：~50 行（减少 67%）

### 新实现

```vue
<template>
  <FloatingDropdown :width="320" class="system-prompt-selector">
    <template #trigger="{ toggle, isOpen }">
      <button @click="toggle" :class="{ active: isOpen }">
        <i class="bi bi-cpu"></i>
        <span>{{ selectedPrompt?.name || '系统提示' }}</span>
        <i class="bi bi-chevron-down" :class="{ rotate: isOpen }"></i>
      </button>
    </template>
    
    <template #dropdown="{ close }">
      <!-- 弹框内容 -->
    </template>
  </FloatingDropdown>
</template>
```

### 优势

- ✅ 代码更简洁
- ✅ 逻辑更清晰
- ✅ 更易维护
- ✅ 复用公共逻辑

## 3. ModelSelector 重构

### 变化对比

#### 重构前
- 自己实现定位逻辑
- 自己管理事件监听
- 代码量：~180 行

#### 重构后
- 使用 FloatingDropdown 组件
- 只关注业务逻辑
- 代码量：~60 行（减少 67%）

### 新实现

```vue
<template>
  <FloatingDropdown :width="360" class="model-selector">
    <template #trigger="{ toggle, isOpen }">
      <button @click="toggle" :class="{ active: isOpen }">
        <i class="bi bi-robot"></i>
        <span>{{ selectedModel?.name || '选择模型' }}</span>
        <i class="bi bi-chevron-down" :class="{ rotate: isOpen }"></i>
      </button>
    </template>
    
    <template #dropdown="{ close }">
      <!-- 弹框内容 -->
    </template>
  </FloatingDropdown>
</template>
```

## 4. 切换输入模式修复

### 问题描述

切换输入模式按钮的图标显示逻辑错误：
- 多行模式时显示"全屏"图标（应该显示"收起"）
- 单行模式时显示"收起"图标（应该显示"全屏"）

### 修复方案

```vue
<!-- 修复前 -->
<i :class="isMultiLine ? 'bi bi-arrows-fullscreen' : 'bi bi-arrows-collapse'"></i>

<!-- 修复后 -->
<i :class="isMultiLine ? 'bi bi-arrows-collapse' : 'bi bi-arrows-fullscreen'"></i>
```

### 逻辑说明

- `isMultiLine = true`（多行模式）→ 显示"收起"图标（bi-arrows-collapse）
- `isMultiLine = false`（单行模式）→ 显示"展开"图标（bi-arrows-fullscreen）

## 代码统计

### 重构前

| 组件 | 代码行数 | 重复逻辑 |
|------|----------|----------|
| SystemPromptSelector | ~150 | 定位、事件监听 |
| ModelSelector | ~180 | 定位、事件监听 |
| 总计 | ~330 | 大量重复 |

### 重构后

| 组件 | 代码行数 | 说明 |
|------|----------|------|
| FloatingDropdown | ~150 | 公共组件 |
| SystemPromptSelector | ~50 | 业务逻辑 |
| ModelSelector | ~60 | 业务逻辑 |
| 总计 | ~260 | 减少 21% |

### 收益

- ✅ 代码量减少 70 行（21%）
- ✅ 消除重复代码
- ✅ 提高可维护性
- ✅ 便于扩展新组件

## 扩展性

### 创建新的选择器

现在创建新的选择器组件非常简单：

```vue
<template>
  <FloatingDropdown :width="300">
    <template #trigger="{ toggle, isOpen }">
      <button @click="toggle">
        我的选择器
      </button>
    </template>
    
    <template #dropdown="{ close }">
      <div class="my-dropdown">
        <!-- 自定义内容 -->
      </div>
    </template>
  </FloatingDropdown>
</template>
```

### 可能的应用场景

- 语言选择器
- 主题选择器
- 用户菜单
- 通知下拉
- 搜索建议
- 任何需要浮动弹框的场景

## 测试场景

### 场景 1：基本功能
1. 点击系统提示词按钮
2. 弹框正常显示
3. 点击外部关闭
4. ✅ 通过

### 场景 2：模型选择
1. 点击模型选择按钮
2. 弹框正常显示
3. 选择一个模型
4. 弹框自动关闭
5. ✅ 通过

### 场景 3：智能定位
1. 滚动到页面底部
2. 点击按钮
3. 弹框向上显示
4. ✅ 通过

### 场景 4：输入模式切换
1. 点击切换输入模式按钮
2. 图标正确切换
3. 输入框高度正确变化
4. ✅ 通过

## 浏览器兼容性

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| FloatingDropdown | 90+ | 88+ | 14+ | 90+ |
| Teleport | 90+ | 88+ | 14+ | 90+ |
| 插槽作用域 | ✅ | ✅ | ✅ | ✅ |

## 性能优化

### 1. 按需计算
- 只在打开时计算位置
- 避免不必要的计算

### 2. 事件委托
- 使用单个全局监听器
- 自动清理事件监听

### 3. 内存管理
- 组件卸载时清理监听器
- 避免内存泄漏

## 未来改进

- [ ] 添加动画配置选项
- [ ] 支持多种定位策略
- [ ] 添加键盘导航
- [ ] 支持嵌套弹框
- [ ] 添加过渡动画钩子

---

**重构日期**: 2026-04-27
**版本**: 1.2.0
**状态**: ✅ 已完成
