# 输入模式切换修复

## 问题描述

点击切换输入模式按钮时，存在以下问题：
- ✅ 从多行模式切换到单行模式：正常（输入框变小）
- ❌ 从单行模式切换回多行模式：失败（输入框无法恢复原来的高度）

## 问题原因

### 原始实现

```javascript
const toggleInputMode = () => {
  isMultiLine.value = !isMultiLine.value
  
  if (!isMultiLine.value) {
    // 切换到单行模式时，设置为最小高度
    inputHeight.value = minHeight
  }
  // 问题：切换回多行模式时，没有恢复高度
}
```

### 问题分析

1. 切换到单行模式时，`inputHeight` 被设置为 `minHeight`（80px）
2. 切换回多行模式时，没有任何操作
3. 结果：`inputHeight` 保持在 `minHeight`，无法恢复

## 解决方案

### 1. 添加高度保存变量

```javascript
const savedHeight = ref(120) // 保存多行模式的高度
```

### 2. 改进切换逻辑

```javascript
const toggleInputMode = () => {
  isMultiLine.value = !isMultiLine.value
  
  if (!isMultiLine.value) {
    // 切换到单行模式：保存当前高度，然后设置为最小高度
    savedHeight.value = inputHeight.value
    inputHeight.value = minHeight
  } else {
    // 切换到多行模式：恢复之前保存的高度
    inputHeight.value = savedHeight.value
  }
}
```

### 3. 拖拽时更新保存的高度

```javascript
const handleMouseUp = () => {
  // ... 其他代码
  
  // 保存高度到localStorage
  localStorage.setItem('quicksearch-chat-input-height', inputHeight.value.toString())
  
  // 如果当前是多行模式，更新保存的高度
  if (isMultiLine.value) {
    savedHeight.value = inputHeight.value
  }
}
```

### 4. 初始化时恢复保存的高度

```javascript
onMounted(() => {
  const savedHeightStr = localStorage.getItem('quicksearch-chat-input-height')
  if (savedHeightStr) {
    const height = parseInt(savedHeightStr)
    if (height >= minHeight && height <= maxHeight) {
      inputHeight.value = height
      savedHeight.value = height // 同时更新保存的高度
    }
  }
  // ... 其他代码
})
```

## 工作流程

### 场景 1：首次使用

1. 用户打开聊天页面
2. `inputHeight` = 120px（默认）
3. `savedHeight` = 120px（默认）
4. 显示多行输入框

### 场景 2：切换到单行模式

1. 用户点击切换按钮
2. `savedHeight` = 120px（保存当前高度）
3. `inputHeight` = 80px（设置为最小高度）
4. 显示单行输入框

### 场景 3：切换回多行模式

1. 用户再次点击切换按钮
2. `inputHeight` = 120px（恢复保存的高度）
3. 显示多行输入框（恢复原来的高度）

### 场景 4：拖拽调整高度

1. 用户在多行模式下拖拽调整高度
2. `inputHeight` = 150px（新高度）
3. 拖拽结束时：`savedHeight` = 150px（更新保存的高度）
4. 切换到单行模式：`inputHeight` = 80px
5. 切换回多行模式：`inputHeight` = 150px（恢复用户自定义的高度）

### 场景 5：页面刷新

1. 用户刷新页面
2. 从 localStorage 读取：height = 150px
3. `inputHeight` = 150px
4. `savedHeight` = 150px（同步更新）
5. 保持用户之前设置的高度

## 状态管理

### 变量说明

| 变量 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| inputHeight | ref(Number) | 120 | 当前输入框高度 |
| savedHeight | ref(Number) | 120 | 保存的多行模式高度 |
| isMultiLine | ref(Boolean) | true | 是否为多行模式 |
| minHeight | Number | 80 | 最小高度 |
| maxHeight | Number | 300 | 最大高度 |

### 状态转换

```
初始状态：
inputHeight = 120
savedHeight = 120
isMultiLine = true

切换到单行：
savedHeight = inputHeight (保存)
inputHeight = minHeight (80)
isMultiLine = false

切换回多行：
inputHeight = savedHeight (恢复)
isMultiLine = true

拖拽调整（多行模式）：
inputHeight = newHeight
savedHeight = newHeight (同步)
```

## 测试用例

### 测试 1：基本切换

1. 打开聊天页面
2. 点击切换按钮 → 输入框变小（80px）
3. 再次点击切换按钮 → 输入框恢复（120px）
4. ✅ 通过

### 测试 2：拖拽后切换

1. 拖拽调整高度到 200px
2. 点击切换按钮 → 输入框变小（80px）
3. 再次点击切换按钮 → 输入框恢复（200px）
4. ✅ 通过

### 测试 3：多次切换

1. 切换到单行模式
2. 切换回多行模式
3. 切换到单行模式
4. 切换回多行模式
5. 每次都能正确恢复高度
6. ✅ 通过

### 测试 4：刷新页面

1. 拖拽调整高度到 180px
2. 刷新页面
3. 高度保持 180px
4. 切换到单行模式 → 80px
5. 切换回多行模式 → 180px
6. ✅ 通过

### 测试 5：边界情况

1. 拖拽到最小高度（80px）
2. 切换到单行模式 → 80px
3. 切换回多行模式 → 80px
4. ✅ 通过

## 代码对比

### 修复前

```javascript
// 变量定义
const inputHeight = ref(120)
const isMultiLine = ref(true)

// 切换逻辑
const toggleInputMode = () => {
  isMultiLine.value = !isMultiLine.value
  
  if (!isMultiLine.value) {
    inputHeight.value = minHeight
  }
  // 问题：没有恢复逻辑
}

// 拖拽结束
const handleMouseUp = () => {
  localStorage.setItem('quicksearch-chat-input-height', inputHeight.value.toString())
  // 问题：没有更新保存的高度
}

// 初始化
onMounted(() => {
  const savedHeight = localStorage.getItem('quicksearch-chat-input-height')
  if (savedHeight) {
    inputHeight.value = parseInt(savedHeight)
  }
  // 问题：没有同步 savedHeight
})
```

### 修复后

```javascript
// 变量定义
const inputHeight = ref(120)
const savedHeight = ref(120) // 新增：保存高度
const isMultiLine = ref(true)

// 切换逻辑
const toggleInputMode = () => {
  isMultiLine.value = !isMultiLine.value
  
  if (!isMultiLine.value) {
    savedHeight.value = inputHeight.value // 保存当前高度
    inputHeight.value = minHeight
  } else {
    inputHeight.value = savedHeight.value // 恢复保存的高度
  }
}

// 拖拽结束
const handleMouseUp = () => {
  localStorage.setItem('quicksearch-chat-input-height', inputHeight.value.toString())
  
  // 新增：更新保存的高度
  if (isMultiLine.value) {
    savedHeight.value = inputHeight.value
  }
}

// 初始化
onMounted(() => {
  const savedHeightStr = localStorage.getItem('quicksearch-chat-input-height')
  if (savedHeightStr) {
    const height = parseInt(savedHeightStr)
    inputHeight.value = height
    savedHeight.value = height // 新增：同步保存的高度
  }
})
```

## 用户体验改进

### 修复前
- ❌ 切换到单行后无法恢复
- ❌ 用户需要重新拖拽调整
- ❌ 体验不连贯

### 修复后
- ✅ 切换自如，高度记忆
- ✅ 保持用户自定义高度
- ✅ 体验流畅自然

## 相关文件

- `web/src/components/MessageInput.vue` - 修复的组件

## 技术要点

1. **状态保存**：使用 `savedHeight` 保存多行模式的高度
2. **双向同步**：拖拽和初始化时都要同步 `savedHeight`
3. **条件更新**：只在多行模式下更新 `savedHeight`
4. **持久化**：使用 localStorage 保存用户偏好

---

**修复日期**: 2026-04-27
**版本**: 1.2.1
**状态**: ✅ 已完成
