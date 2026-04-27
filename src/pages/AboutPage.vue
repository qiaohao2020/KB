<template>
  <div class="about-page">
    <div class="page-header">
      <h1>关于 QuickSearch</h1>
      <p>了解更多关于我们的产品信息</p>
    </div>
    
    <div class="about-content">
      <!-- 应用信息 -->
      <div class="about-section">
        <div class="section-header">
          <i class="bi bi-info-circle"></i>
          <h3>应用信息</h3>
        </div>
        <div class="app-info-card">
          <div class="app-logo">
            <img src="@/assets/images/logo.svg" alt="QuickSearch Logo" />
          </div>
          <div class="app-details">
            <h2>QuickSearch</h2>
            <p class="version">版本 1.0.0</p>
            <p class="description">智能浏览器扩展助手</p>
            <p class="subtitle">提供智能聊天、知识库管理、内容检索和历史记录功能的现代化浏览器扩展</p>
          </div>
        </div>
      </div>

      <!-- 功能特性 -->
      <div class="about-section">
        <div class="section-header">
          <i class="bi bi-star"></i>
          <h3>主要功能</h3>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <i class="bi bi-chat-dots"></i>
            <h4>智能问答</h4>
            <p>基于AI的智能对话系统，支持多种AI模型</p>
          </div>
          <div class="feature-card">
            <i class="bi bi-book"></i>
            <h4>知识库管理</h4>
            <p>个人知识库构建与管理，支持分类和标签</p>
          </div>
          <div class="feature-card">
            <i class="bi bi-search"></i>
            <h4>内容检索</h4>
            <p>快速搜索和检索已保存的内容和对话</p>
          </div>
          <div class="feature-card">
            <i class="bi bi-clock-history"></i>
            <h4>历史记录</h4>
            <p>完整的使用历史记录和数据管理</p>
          </div>
        </div>
      </div>

      <!-- 帮助链接 -->
      <div class="about-section">
        <div class="section-header">
          <i class="bi bi-question-circle"></i>
          <h3>帮助与支持</h3>
        </div>
        <div class="help-links">
          <a href="#" class="help-link" @click="openHelp">
            <i class="bi bi-book-half"></i>
            <div>
              <h4>使用帮助</h4>
              <p>查看详细的使用指南和常见问题解答</p>
            </div>
            <i class="bi bi-chevron-right"></i>
          </a>
          <a href="#" class="help-link" @click="openPrivacyPolicy">
            <i class="bi bi-shield-check"></i>
            <div>
              <h4>隐私政策</h4>
              <p>了解我们如何保护您的数据和隐私</p>
            </div>
            <i class="bi bi-chevron-right"></i>
          </a>
          <a href="#" class="help-link" @click="openFeedback">
            <i class="bi bi-chat-square-text"></i>
            <div>
              <h4>反馈建议</h4>
              <p>向我们提供宝贵的意见和建议</p>
            </div>
            <i class="bi bi-chevron-right"></i>
          </a>
        </div>
      </div>

      <!-- 技术信息 -->
      <div class="about-section">
        <div class="section-header">
          <i class="bi bi-code-square"></i>
          <h3>技术信息</h3>
        </div>
        <div class="tech-info">
          <div class="tech-item">
            <span class="label">框架版本:</span>
            <span class="value">Vue.js 3.4.0</span>
          </div>
          <div class="tech-item">
            <span class="label">构建工具:</span>
            <span class="value">Vite 5.0.0</span>
          </div>
          <div class="tech-item">
            <span class="label">扩展版本:</span>
            <span class="value">Manifest V3</span>
          </div>
          <div class="tech-item">
            <span class="label">许可证:</span>
            <span class="value">MIT License</span>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="about-section">
        <div class="copyright">
          <p>&copy; 2024 QuickSearch. All rights reserved.</p>
          <p>Built with ❤️ using Vue.js and modern web technologies.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  methods: {
    openHelp() {
      // 打开使用帮助页面或弹窗
      this.showModal('使用帮助', `
        <h3>快速开始</h3>
        <p>1. 点击侧边栏的各个功能模块开始使用</p>
        <p>2. 在设置页面配置您的AI服务提供商</p>
        <p>3. 开始创建您的个人知识库</p>
        
        <h3>主要功能</h3>
        <p><strong>智能问答:</strong> 与AI助手进行对话，获取帮助和答案</p>
        <p><strong>知识库:</strong> 保存和管理您的重要信息</p>
        <p><strong>内容检索:</strong> 快速找到您需要的内容</p>
        <p><strong>历史记录:</strong> 查看和管理您的使用历史</p>
        
        <h3>常见问题</h3>
        <p><strong>Q: 如何配置AI服务?</strong></p>
        <p>A: 进入设置页面，选择AI提供商并输入相应的API密钥。</p>
        
        <p><strong>Q: 数据存储在哪里?</strong></p>
        <p>A: 所有数据都存储在您的本地浏览器中，确保隐私安全。</p>
      `)
    },
    
    openPrivacyPolicy() {
      // 打开隐私政策
      this.showModal('隐私政策', `
        <h3>数据收集</h3>
        <p>QuickSearch 不会收集您的个人信息。所有数据都存储在您的本地设备上。</p>
        
        <h3>数据存储</h3>
        <p>• 聊天记录存储在浏览器的本地存储中</p>
        <p>• 知识库内容仅保存在您的设备上</p>
        <p>• API密钥等敏感信息经过加密存储</p>
        
        <h3>第三方服务</h3>
        <p>当您使用AI功能时，您的消息会发送到您配置的AI服务提供商（如OpenAI、Claude等）。请查看相应服务商的隐私政策。</p>
        
        <h3>数据安全</h3>
        <p>• 我们不会访问或传输您的个人数据</p>
        <p>• 您可以随时导出或删除您的数据</p>
        <p>• 扩展仅在您明确授权的情况下访问网页内容</p>
        
        <h3>联系我们</h3>
        <p>如果您对隐私政策有任何疑问，请通过反馈功能联系我们。</p>
      `)
    },
    
    openFeedback() {
      // 打开反馈表单
      this.showModal('反馈建议', `
        <h3>我们重视您的意见</h3>
        <p>您的反馈对我们改进产品非常重要。请选择以下方式之一联系我们：</p>
        
        <div style="margin: 20px 0;">
          <h4>反馈类型</h4>
          <p>• 功能建议</p>
          <p>• 问题报告</p>
          <p>• 使用体验</p>
          <p>• 其他意见</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h4>联系方式</h4>
          <p>由于这是演示版本，请通过以下方式提供反馈：</p>
          <p>• 在浏览器扩展商店中评价</p>
          <p>• 通过开发者工具的控制台留言</p>
          <p>• 在项目的GitHub页面提交Issue</p>
        </div>
        
        <p><strong>感谢您的支持！</strong></p>
      `)
    },
    
    showModal(title, content) {
      // 创建模态框显示内容
      const modal = document.createElement('div')
      modal.className = 'modal-overlay'
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>${title}</h2>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
        </div>
      `
      
      // 添加样式
      const style = document.createElement('style')
      style.textContent = `
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }
        .modal-header h2 {
          margin: 0;
          color: #333;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .modal-close:hover {
          background: #f1f5f9;
          color: #333;
        }
        .modal-body {
          padding: 24px;
          line-height: 1.6;
        }
        .modal-body h3 {
          color: #333;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .modal-body h4 {
          color: #4a6cf7;
          margin-top: 16px;
          margin-bottom: 8px;
        }
        .modal-body p {
          margin-bottom: 12px;
          color: #666;
        }
      `
      
      document.head.appendChild(style)
      document.body.appendChild(modal)
      
      // 关闭模态框
      const closeModal = () => {
        document.body.removeChild(modal)
        document.head.removeChild(style)
      }
      
      modal.querySelector('.modal-close').addEventListener('click', closeModal)
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal()
      })
      
      // ESC键关闭
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          closeModal()
          document.removeEventListener('keydown', handleEsc)
        }
      }
      document.addEventListener('keydown', handleEsc)
    }
  }
}
</script>

<style scoped>
.about-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.about-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.about-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.section-header i {
  font-size: 20px;
  color: #4a6cf7;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 应用信息卡片 */
.app-info-card {
  display: flex;
  align-items: center;
  gap: 24px;
}

.app-logo img {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.app-details h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.version {
  display: inline-block;
  background: #4a6cf7;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.description {
  font-size: 16px;
  font-weight: 500;
  color: #4a6cf7;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* 功能特性网格 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-card {
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-align: center;
  transition: all 0.2s ease;
}

.feature-card:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
  transform: translateY(-2px);
}

.feature-card i {
  font-size: 32px;
  color: #4a6cf7;
  margin-bottom: 12px;
}

.feature-card h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.feature-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

/* 帮助链接 */
.help-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.help-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}

.help-link:hover {
  border-color: #4a6cf7;
  background: #f8faff;
  transform: translateX(4px);
}

.help-link > i:first-child {
  font-size: 24px;
  color: #4a6cf7;
  flex-shrink: 0;
}

.help-link > div {
  flex: 1;
}

.help-link h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.help-link p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.help-link > i:last-child {
  font-size: 16px;
  color: #999;
  flex-shrink: 0;
}

/* 技术信息 */
.tech-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.tech-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8faff;
  border-radius: 6px;
  border-left: 3px solid #4a6cf7;
}

.tech-item .label {
  font-weight: 500;
  color: #333;
}

.tech-item .value {
  color: #4a6cf7;
  font-weight: 600;
}

/* 版权信息 */
.copyright {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid #e2e8f0;
}

.copyright p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-info-card {
    flex-direction: column;
    text-align: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-info {
    grid-template-columns: 1fr;
  }
  
  .help-link {
    padding: 12px;
  }
  
  .about-section {
    padding: 16px;
    margin-bottom: 16px;
  }
}
</style>