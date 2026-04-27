# 🔧 故障排除指南

## 问题：画面没有响应内容

### 快速诊断步骤

#### 1️⃣ 使用简化版本测试

首先尝试运行简化版本，确认基础功能是否正常：

```bash
npm run dev:simple
```

这将打开一个简化的测试页面。如果这个可以正常工作，说明问题在于完整版本的组件加载。

#### 2️⃣ 检查浏览器控制台

1. 打开浏览器开发者工具（F12）
2. 切换到"Console"标签
3. 查看是否有错误信息

常见错误：
- ❌ `Failed to resolve import` - 文件路径错误
- ❌ `Cannot find module` - 组件不存在
- ❌ `Unexpected token` - 语法错误
- ❌ `404 Not Found` - 文件不存在

#### 3️⃣ 检查网络请求

1. 在开发者工具中切换到"Network"标签
2. 刷新页面
3. 查看是否有失败的请求（红色）

#### 4️⃣ 检查Vue DevTools

如果安装了Vue DevTools：
1. 打开Vue DevTools
2. 查看组件树是否正常加载
3. 检查路由状态

## 常见问题和解决方案

### 问题1: 页面完全空白

**可能原因：**
- JavaScript错误导致应用无法挂载
- #app元素不存在
- 模块导入失败

**解决方案：**
```bash
# 1. 清除缓存并重启
Ctrl + Shift + R (硬刷新)

# 2. 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 3. 使用简化版本测试
npm run dev:simple
```

### 问题2: 组件加载失败

**可能原因：**
- 组件文件不存在
- 导入路径错误
- 组件语法错误

**解决方案：**
```bash
# 检查文件是否存在
ls src/pages/ChatPage.vue
ls src/components/ChatContainer.vue

# 查看文件内容
cat src/pages/ChatPage.vue
```

### 问题3: 路由不工作

**可能原因：**
- 路由配置错误
- history模式配置问题

**解决方案：**
1. 检查浏览器URL是否正确
2. 尝试点击导航菜单
3. 查看控制台是否有路由错误

### 问题4: 样式不显示

**可能原因：**
- CSS文件加载失败
- Bootstrap Icons CDN无法访问

**解决方案：**
```bash
# 检查网络连接
ping cdn.jsdelivr.net

# 或使用本地Bootstrap Icons
npm install bootstrap-icons
```

### 问题5: Vite服务器错误

**可能原因：**
- 端口被占用
- 配置文件错误
- 依赖版本冲突

**解决方案：**
```bash
# 1. 检查端口
netstat -ano | findstr :5173

# 2. 使用不同端口
vite --port 3000

# 3. 重新安装Vite
npm install vite@latest
```

## 调试技巧

### 1. 启用详细日志

在`vite.config.js`中添加：
```javascript
export default defineConfig({
  logLevel: 'info',
  // ...
})
```

### 2. 使用console.log调试

在`web.js`中添加调试信息：
```javascript
console.log('App starting...')
const app = createApp(App)
console.log('App created:', app)
app.mount('#app')
console.log('App mounted')
```

### 3. 检查Vue实例

在浏览器控制台中：
```javascript
// 检查Vue是否加载
window.__VUE__

// 检查路由
window.__VUE_ROUTER__
```

### 4. 逐步排查

创建最小可复现示例：
```html
<!DOCTYPE html>
<html>
<head>
  <title>Test</title>
</head>
<body>
  <div id="app">{{ message }}</div>
  <script type="module">
    import { createApp } from 'vue'
    createApp({
      data() {
        return { message: 'Hello Vue!' }
      }
    }).mount('#app')
  </script>
</body>
</html>
```

## 测试清单

使用此清单逐项检查：

- [ ] Node.js版本 >= 14.0.0
- [ ] npm install 成功完成
- [ ] 没有依赖警告或错误
- [ ] Vite服务器成功启动
- [ ] 浏览器可以访问localhost:5173
- [ ] 浏览器控制台没有错误
- [ ] Network标签显示所有请求成功
- [ ] #app元素存在于HTML中
- [ ] Vue应用成功挂载
- [ ] 路由正常工作
- [ ] 样式正确加载

## 获取帮助

如果以上方法都无法解决问题：

1. **收集信息：**
   - Node.js版本: `node --version`
   - npm版本: `npm --version`
   - 操作系统
   - 浏览器版本
   - 完整的错误信息
   - 控制台截图

2. **创建Issue：**
   - 访问GitHub仓库
   - 创建新Issue
   - 提供上述信息

3. **临时解决方案：**
   ```bash
   # 使用简化版本
   npm run dev:simple
   
   # 或使用测试页面
   npm run test:ui
   ```

## 成功案例

### 案例1: CSS导入错误

**问题：** `Failed to resolve import "../assets/css/main.css"`

**解决：** 
```javascript
// 修改前
import '../assets/css/main.css'

// 修改后
import '../assets/css/web.css'
```

### 案例2: 组件路径错误

**问题：** `Cannot find module '@/components/ChatContainer.vue'`

**解决：**
```javascript
// 检查vite.config.js中的alias配置
resolve: {
  alias: {
    '@': resolve(__dirname, 'src')
  }
}
```

### 案例3: 空白HTML

**问题：** web.html文件为空

**解决：** 重新创建web.html文件，确保包含：
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>QuickSearch</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./web.js"></script>
</body>
</html>
```

## 预防措施

1. **定期备份：** 在修改前备份工作文件
2. **版本控制：** 使用Git跟踪更改
3. **测试驱动：** 先在简化版本测试新功能
4. **渐进增强：** 逐步添加功能，每次测试
5. **文档记录：** 记录所有配置更改

---

**���住：** 大多数问题都可以通过仔细检查错误信息和逐步排查来解决。保持耐心！🔍
