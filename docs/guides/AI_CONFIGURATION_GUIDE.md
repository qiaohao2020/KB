# AI配置使用指南

## 🤖 AI配置功能

QuickSearch扩展现在支持多种AI服务提供商，您可以在设置页面中配置您的AI服务。

## 🔧 支持的AI提供商

### 1. OpenAI
- **API Base URL**: `https://api.openai.com/v1`
- **支持模型**:
  - GPT-4o (最新模型)
  - GPT-4o Mini (轻量级)
  - GPT-4 Turbo (高性能)
  - GPT-3.5 Turbo (经济实用)

### 2. Azure OpenAI
- **API Base URL**: `https://your-resource.openai.azure.com`
- **API版本**: 2024-02-15-preview (推荐)
- **支持模型**: GPT-4, GPT-3.5 Turbo

### 3. Anthropic Claude
- **API Base URL**: `https://api.anthropic.com`
- **支持模型**:
  - Claude 3.5 Sonnet (最新)
  - Claude 3 Opus (最强大)
  - Claude 3 Haiku (快速响应)

### 4. 自定义API
- 支持兼容OpenAI API格式的自定义服务

## ⚙️ 配置步骤

### 1. 打开设置页面
1. 点击扩展图标打开popup
2. 点击"打开侧边栏"
3. 在侧边栏中点击"设置"

### 2. 配置AI服务
1. **选择API提供商**: 从下拉菜单选择您的AI服务提供商
2. **设置API Base URL**: 
   - OpenAI用户可以留空使用默认地址
   - Azure用户需要填入您的资源地址
   - 自定义服务需要填入完整API地址
3. **输入API Key**: 输入您的API密钥
4. **选择默认模型**: 根据提供商选择合适的模型
5. **调整参数**:
   - **温度**: 控制回复的创造性 (0-2)
   - **最大Token数**: 单次对话的长度限制
   - **系统提示词**: 定义AI助手的行为和角色

### 3. 测试连接
点击"测试连接"按钮验证配置是否正确。

## 🔑 获取API Key

### OpenAI API Key
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 登录您的账户
3. 进入 API Keys 页面
4. 点击 "Create new secret key"
5. 复制生成的API Key

### Azure OpenAI API Key
1. 登录 [Azure Portal](https://portal.azure.com/)
2. 找到您的OpenAI资源
3. 在"Keys and Endpoint"页面获取API Key和Endpoint

### Anthropic API Key
1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 登录您的账户
3. 在API Keys页面创建新的密钥

## 📋 配置示例

### OpenAI配置
```
API提供商: OpenAI
API Base URL: (留空或 https://api.openai.com/v1)
API Key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
默认模型: gpt-4o-mini
温度: 0.7
最大Token数: 4000
```

### Azure OpenAI配置
```
API提供商: Azure OpenAI
API Base URL: https://your-resource.openai.azure.com
API Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Azure API Version: 2024-02-15-preview
默认模型: gpt-4
温度: 0.7
最大Token数: 4000
```

### Claude配置
```
API提供商: Anthropic Claude
API Base URL: https://api.anthropic.com
API Key: sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
默认模型: claude-3-5-sonnet-20241022
温度: 0.7
最大Token数: 4000
```

## 🎯 系统提示词示例

### 通用助手
```
你是一个有用的AI助手，能够帮助用户解答问题、处理任务和提供建议。请用简洁、准确、友好的方式回复用户。
```

### 编程助手
```
你是一个专业的编程助手，擅长多种编程语言和技术。请提供准确的代码示例和技术建议，并解释代码的工作原理。
```

### 写作助手
```
你是一个专业的写作助手，能够帮助用户改进文本、纠正语法、优化表达。请提供建设性的建议和具体的改进方案。
```

## 🔒 安全注意事项

1. **API Key安全**: 
   - 不要与他人分享您的API Key
   - 定期轮换API Key
   - 监控API使用情况

2. **数据隐私**:
   - 了解各AI服务商的数据处理政策
   - 避免发送敏感信息
   - 考虑使用本地部署的AI服务

3. **成本控制**:
   - 设置合理的Token限制
   - 监控API使用量和费用
   - 根据需要选择合适的模型

## 🛠️ 故障排除

### 常见问题

1. **连接测试失败**
   - 检查API Key是否正确
   - 验证API Base URL格式
   - 确认网络连接正常
   - 检查API服务状态

2. **模型不可用**
   - 确认您的账户有权限使用该模型
   - 检查模型名称是否正确
   - 尝试使用其他可用模型

3. **请求超时**
   - 降低最大Token数设置
   - 检查网络连接稳定性
   - 尝试更换API端点

### 错误代码说明

- **401 Unauthorized**: API Key无效或过期
- **403 Forbidden**: 没有权限访问该资源
- **429 Too Many Requests**: 请求频率过高，需要等待
- **500 Internal Server Error**: API服务内部错误

## 📞 技术支持

如果您在配置过程中遇到问题：

1. 检查本指南的故障排除部分
2. 查看浏览器控制台的错误信息
3. 验证API服务商的官方文档
4. 确保扩展程序是最新版本

## 🔄 配置更新

当您更改AI配置后：
1. 设置会自动保存
2. 新配置立即生效
3. 建议测试连接确保配置正确
4. 可以随时在设置页面修改配置