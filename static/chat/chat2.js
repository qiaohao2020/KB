document.addEventListener('DOMContentLoaded', () => {
  // 初始化Vue应用
  const { createApp, ref, onMounted, nextTick, computed, watch } = Vue;
  
  // 创建Vue应用
  const app = createApp({
    setup() {
      // 响应式状态
      const messages = ref([]);
      const inputMessage = ref('');
      const selectedCategory = ref('常用');
      const chatMessages = ref(null);
      const currentNav = ref('chat');
      const roleSearch = ref('');
      const chatSearch = ref('');
      const roles = ref([]);
      const showSidebar = ref(true);
      const chatList = ref([]);
      const currentChatId = ref(null);
      const categories = ref([]);
      const prompts = ref([]);
      const messageInput = ref(null);
      const isSidebarResizing = ref(false);
      const showAboutModal = ref(false);
      const showDownloadOptions = ref(false);
      
      // 导航项
      const navItems = [
        {id: 'chat', title: '聊天列表', icon: 'fas fa-comments'},
        {id: 'roles', title: '预设角色', icon: 'fas fa-user-tie'},
        {id: 'prompts', title: '提示词模板', icon: 'fas fa-list'},
        {id: 'mermaid', title: 'Diagram编辑器', icon: 'fas fa-sitemap'},
        {id: 'echarts', title: 'ECharts编辑器', icon: 'fas fa-chart-line'},
        {id: 'markdown', title: 'Markdown编辑器', icon: 'fas fa-file-alt'},
        {id: 'workflow', title: '工作流', icon: 'fas fa-project-diagram'}
      ];
      
      // 获取当前标签页的内容
      async function getCurrentTabContent() {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (!tab) {
            return { title: '无法获取页面内容', paragraphs: [], headings: [] };
          }
          
          return new Promise((resolve) => {
            chrome.tabs.sendMessage(tab.id, { action: 'getPageContent' }, (response) => {
              if (chrome.runtime.lastError) {
                console.error('获取页面内容失败:', chrome.runtime.lastError);
                resolve({ title: '无法获取页面内容', paragraphs: [], headings: [] });
              } else {
                resolve(response || { title: '无法获取页面内容', paragraphs: [], headings: [] });
              }
            });
          });
        } catch (error) {
          console.error('获取当前标签页失败:', error);
          return { title: '无法获取页面内容', paragraphs: [], headings: [] };
        }
      }
      
      // 生成内容摘要
      function generateSummary(content) {
        if (!content) {
          return '无法获取页面内容';
        }
        
        const summary = [];
        
        // 添加标题
        if (content.title) {
          summary.push(`页面标题：${content.title}`);
        }
        
        // 添加主要标题
        if (content.headings && content.headings.length > 0) {
          summary.push('主要章节：');
          content.headings.slice(0, 5).forEach(heading => {
            summary.push(`- ${heading}`);
          });
        }
        
        // 添加段落摘要
        if (content.paragraphs && content.paragraphs.length > 0) {
          summary.push('内容要点：');
          content.paragraphs.slice(0, 3).forEach(paragraph => {
            // 截取段落前100个字符
            const preview = paragraph.length > 100 
              ? paragraph.substring(0, 100) + '...' 
              : paragraph;
            summary.push(`- ${preview}`);
          });
        }
        
        return summary.join('\n');
      }
      
      // 加载提示词模板数据
      const loadPrompts = async () => {
        try {
          const response = await fetch('../json/prompts-zh.json');
          const data = await response.json();
          categories.value = data.categories;
          // 默认显示第一个分类的提示词
          if (categories.value.length > 0) {
            selectedCategory.value = categories.value[0].name;
            prompts.value = categories.value[0].prompts;
          }
        } catch (error) {
          console.error('加载提示词模板失败:', error);
        }
      };
      
      // 监听分类变化，更新提示词列表
      watch(selectedCategory, (newCategory) => {
        const category = categories.value.find(c => c.name === newCategory);
        if (category) {
          prompts.value = category.prompts;
        }
      });
      
      // 加载预设角色数据
      const loadRoles = async () => {
        try {
          const response = await fetch('../json/roles.json');
          roles.value = await response.json();
        } catch (error) {
          console.error('加载预设角色失败:', error);
        }
      };
      
      // 过滤预设角色
      const filteredRoles = computed(() => {
        if (!roleSearch.value) return roles.value;
        const searchText = roleSearch.value.toLowerCase();
        return roles.value.filter(role =>
          role.act.toLowerCase().includes(searchText) ||
          role.prompt.toLowerCase().includes(searchText)
        );
      });
      
      // 选择预设角色
      const selectRole = (role) => {
        // 更新输入框内容
        inputMessage.value = role.prompt;
        
        // 如果当前有聊天，添加AI提示信息
        if (currentChatId.value) {
          const chat = chatList.value.find(c => c.id === currentChatId.value);
          if (chat) {
            // 添加AI提示信息
            messages.value.push({
              type: 'received',
              content: `已切换到角色：${role.act}\n${role.prompt}`,
              timestamp: new Date().toISOString()
            });
            
            // 更新聊天标题
            chat.title = role.act;
            
            // 保存更改
            saveMessages();
            scrollToBottom();
          }
        }
      };
      
      // 切换导航
      const switchNav = (navId) => {
        if (currentNav.value === navId) {
          showSidebar.value = !showSidebar.value;
        } else {
          showSidebar.value = true;
          currentNav.value = navId;
          if (navId === 'roles') {
            loadRoles();
          } else if (navId === 'prompts') {
            loadPrompts();
          } else if (navId === 'mermaid') {
            openDiagramEditor();
          } else if (navId === 'echarts') {
            openEchartsEditor();
          } else if (navId === 'markdown') {
            openMarkdownEditor();
          } else if (navId === 'workflow') {
            openWorkflowEditor();
          } else if (navId === 'links') {
            openLinks();
          }
        }
      };
      
      // 加载聊天列表
      const loadChatList = () => {
        const savedChatList = localStorage.getItem('chatList');
        if (savedChatList) {
          chatList.value = JSON.parse(savedChatList);
        }
      };
      
      // 保存聊天列表
      const saveChatList = () => {
        localStorage.setItem('chatList', JSON.stringify(chatList.value));
      };
      
      // 格式化时间
      const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        // 如果是今天
        if (date.toDateString() === now.toDateString()) {
          return date.toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'});
        }
        
        // 如果是昨天
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
          return '昨天';
        }
        
        // 如果是今年
        if (date.getFullYear() === now.getFullYear()) {
          return date.toLocaleDateString('zh-CN', {month: '2-digit', day: '2-digit'});
        }
        
        // 其他情况显示完整日期
        return date.toLocaleDateString('zh-CN', {year: 'numeric', month: '2-digit', day: '2-digit'});
      };
      
      // 创建新聊天
      const createNewChat = () => {
        const newChat = {
          id: Date.now().toString(),
          title: '新对话',
          createTime: new Date().toISOString(),
          messages: [{
            type: 'received',
            content: '你好！我是AI助手，有什么我可以帮你的吗？',
            timestamp: new Date().toISOString()
          }]
        };
        chatList.value.push(newChat);
        saveChatList();
        switchChat(newChat.id);
      };
      
      // 切换聊天
      const switchChat = (chatId) => {
        currentChatId.value = chatId;
        const chat = chatList.value.find(c => c.id === chatId);
        if (chat) {
          messages.value = chat.messages;
          scrollToBottom();
        }
      };
      
      // 删除聊天
      const deleteChat = (chatId) => {
        if (confirm('确定要删除这个对话吗？')) {
          const index = chatList.value.findIndex(c => c.id === chatId);
          if (index !== -1) {
            chatList.value.splice(index, 1);
            saveChatList();
            if (currentChatId.value === chatId) {
              if (chatList.value.length > 0) {
                switchChat(chatList.value[0].id);
              } else {
                createNewChat();
              }
            }
          }
        }
      };
      
      // 发送消息函数
      const sendMessage = async () => {
        const message = inputMessage.value.trim();
        if (message) {
          messages.value.push({
            type: 'sent',
            content: message,
            timestamp: new Date().toISOString()
          });
          
          // 更新当前聊天的标题
          if (currentChatId.value) {
            const chat = chatList.value.find(c => c.id === currentChatId.value);
            if (chat) {
              chat.title = message.substring(0, 20) + (message.length > 20 ? '...' : '');
              saveChatList();
            }
          }
          
          // 清空输入框并调整高度
          inputMessage.value = '';
          if (messageInput.value) {
            messageInput.value.style.height = '24px';
          }
          
          // 保存消息并滚动到底部
          saveMessages();
          scrollToBottom();
          
          try {
            // 模拟AI回复
            setTimeout(() => {
              messages.value.push({
                type: 'received',
                content: '这是一条自动回复消息，实际应用中这里会调用AI API获取回复。',
                timestamp: new Date().toISOString()
              });
              
              // 保存消息并滚动到底部
              saveMessages();
              scrollToBottom();
            }, 1000);
          } catch (error) {
            console.error('AI回复失败:', error);
            
            // 添加错误消息
            messages.value.push({
              type: 'received',
              content: '抱歉，我遇到了一些问题，无法回复您的消息。',
              timestamp: new Date().toISOString()
            });
          }
          
          // 保存消息并滚动到底部
          saveMessages();
          scrollToBottom();
        }
      };
      
      // 选择提示词
      const selectPrompt = (prompt) => {
        inputMessage.value = prompt;
      };
      
      // 清空聊天
      const clearChat = () => {
        if (confirm('确定要清空所有对话吗？')) {
          messages.value = [{
            type: 'received',
            content: '你好！我是AI助手，有什么我可以帮你的吗？',
            timestamp: new Date().toISOString()
          }];
          saveMessages();
          scrollToBottom();
        }
      };
      
      // 刷新聊天
      const refreshChat = () => {
        loadMessages();
        scrollToBottom();
      };
      
      // 打开设置
      const openSettings = () => {
        window.open('settings.html', '_blank');
      };
      
      // 加载聊天记录
      const loadMessages = () => {
        const savedMessages = localStorage.getItem('chatHistory');
        if (savedMessages) {
          messages.value = JSON.parse(savedMessages);
        } else {
          messages.value = [{
            type: 'received',
            content: '你好！我是AI助手，有什么我可以帮你的吗？',
            timestamp: new Date().toISOString()
          }];
          saveMessages();
        }
      };
      
      // 保存消息函数
      const saveMessages = () => {
        if (currentChatId.value) {
          const chat = chatList.value.find(c => c.id === currentChatId.value);
          if (chat) {
            chat.messages = messages.value;
            saveChatList();
          }
        }
      };
      
      // 滚动到底部
      const scrollToBottom = async () => {
        await nextTick();
        if (chatMessages.value) {
          chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
        }
      };
      
      // 清空全部聊天
      const clearAllChats = () => {
        if (confirm('确定要清空所有对话吗？此操作不可恢复。')) {
          chatList.value = [];
          saveChatList();
          createNewChat();
        }
      };
      
      // 开始调整侧边栏大小
      const startSidebarResize = (e) => {
        isSidebarResizing.value = true;
        sidebarStartX = e.clientX;
        currentSidebar = e.target.parentElement;
        sidebarStartWidth = currentSidebar.offsetWidth;
        document.addEventListener('mousemove', sidebarResize);
        document.addEventListener('mouseup', stopSidebarResize);
      };
      
      // 调整侧边栏大小
      const sidebarResize = (e) => {
        if (!isSidebarResizing.value || !currentSidebar) return;
        const deltaX = e.clientX - sidebarStartX;
        const newWidth = sidebarStartWidth + deltaX;
        currentSidebar.style.width = `${Math.max(260, Math.min(600, newWidth))}px`;
        currentSidebar.style.minWidth = `${Math.max(260, Math.min(600, newWidth))}px`;
      };
      
      // 停止调整侧边栏大小
      const stopSidebarResize = () => {
        isSidebarResizing.value = false;
        currentSidebar = null;
        document.removeEventListener('mousemove', sidebarResize);
        document.removeEventListener('mouseup', stopSidebarResize);
      };
      
      // 重新生成消息
      const regenerateMessage = (index) => {
        const message = messages.value[index];
        // 移除当前消息
        messages.value.splice(index, 1);
        // 添加新的加载状态消息
        messages.value.splice(index, 0, {
          type: 'received',
          content: '正在重新生成...',
          timestamp: new Date().toISOString()
        });
        scrollToBottom();
        
        // 模拟重新生成
        setTimeout(() => {
          messages.value[index] = {
            type: 'received',
            content: `重新生成的消息：${message.content}`,
            timestamp: new Date().toISOString()
          };
          saveMessages();
          scrollToBottom();
        }, 1000);
      };
      
      // 复制消息内容
      const copyMessage = (content) => {
        navigator.clipboard.writeText(content).then(() => {
          // 可以添加复制成功的提示
          alert('已复制到剪贴板');
        }).catch(err => {
          console.error('复制失败:', err);
        });
      };
      
      // 渲染Markdown内容
      const renderMarkdown = (content) => {
        if (!content) return '';
        
        // 配置marked选项
        marked.setOptions({
          highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
              try {
                return hljs.highlight(code, { language: lang }).value;
              } catch (e) {
                console.error(e);
              }
            }
            return hljs.highlightAuto(code).value;
          },
          breaks: true,
          gfm: true
        });
        
        // 渲染Markdown
        const html = marked.parse(content);
        
        // 使用nextTick确保DOM已更新
        nextTick(() => {
          // 查找所有mermaid图表并渲染
          const mermaidElements = document.querySelectorAll('.message-content .mermaid');
          mermaidElements.forEach(element => {
            try {
              mermaid.render('mermaid-' + Math.random().toString(36).substring(2, 9), element.textContent)
                .then(result => {
                  element.innerHTML = result.svg;
                })
                .catch(error => {
                  console.error('Mermaid渲染错误:', error);
                  element.innerHTML = `<pre>${element.textContent}</pre>`;
                });
            } catch (error) {
              console.error('Mermaid处理错误:', error);
              element.innerHTML = `<pre>${element.textContent}</pre>`;
            }
          });
          
          // 为所有代码块添加操作按钮
          const codeBlocks = document.querySelectorAll('.message-content pre code');
          codeBlocks.forEach(block => {
            const pre = block.parentElement;
            if (!pre.querySelector('.code-actions')) {
              const actions = document.createElement('div');
              actions.className = 'code-actions';
              
              // 添加语言类型显示
              const language = block.className.replace('language-', '') || 'text';
              const languageSpan = document.createElement('span');
              languageSpan.className = 'code-language';
              languageSpan.textContent = language;
              actions.appendChild(languageSpan);
              
              const copyBtn = document.createElement('button');
              copyBtn.className = 'code-action-btn';
              copyBtn.title = '复制代码';
              copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
              copyBtn.onclick = (e) => {
                e.stopPropagation();
                copyCode(block.textContent);
              };
              
              const editBtn = document.createElement('button');
              editBtn.className = 'code-action-btn';
              editBtn.title = '编辑代码';
              editBtn.innerHTML = '<i class="fas fa-edit"></i>';
              editBtn.onclick = (e) => {
                e.stopPropagation();
                editCode(block.textContent);
              };
              
              actions.appendChild(copyBtn);
              actions.appendChild(editBtn);
              pre.appendChild(actions);
            }
          });
        });
        
        return html;
      };
      
      // 复制代码
      const copyCode = (code) => {
        navigator.clipboard.writeText(code)
          .then(() => {
            // 可以添加复制成功的提示
            alert('代码已复制到剪贴板');
          })
          .catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
          });
      };
      
      // 编辑代码
      const editCode = (code) => {
        // 将代码放入输入框
        inputMessage.value = code;
        // 滚动到输入框
        messageInput.value.scrollIntoView({ behavior: 'smooth' });
        // 聚焦输入框
        messageInput.value.focus();
      };
      
      // 打开提示词模板编辑器
      const openPromptEditor = () => {
        window.open('editor-prompt.html', '_blank');
      };
      
      // 打开预设角色编辑器
      const openRoleEditor = () => {
        window.open('editor-role.html', '_blank');
      };
      
      // 打开 DiagramMermaid 编辑器
      const openDiagramEditor = () => {
        window.open('editor-diagram.html', '_blank');
      };
      
      // 打开 ECharts 编辑器
      const openEchartsEditor = () => {
        window.open('editor-echarts.html', '_blank');
      };
      
      const openMarkdownEditor = () => {
        window.open('editor-markdown.html', '_blank');
      };
      
      // 打开 Workflow 编辑器
      const openWorkflowEditor = () => {
        window.open('editor-workflow.html', '_blank');
      };
      
      const openLinks = () => {
        window.open('links.html', '_blank');
      };
      
      const copyChat = () => {
        if (messages.value.length === 0) {
          alert('没有可分享的聊天记录');
          return;
        }
        
        try {
          // 准备分享内容
          let shareContent = '';
          
          // 添加聊天标题和时间
          const now = new Date();
          const formattedDate = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
          
          shareContent += `AI 聊天记录\n\n`;
          shareContent += `生成时间: ${formattedDate}\n\n`;
          shareContent += `----------------------------------------\n\n`;
          
          // 添加每条消息
          messages.value.forEach((message, index) => {
            const sender = message.type === 'sent' ? '你' : 'AI';
            const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleString('zh-CN') : '';
            
            shareContent += `${sender} (${timestamp}):\n`;
            shareContent += `${message.content}\n\n`;
            
            // 在消息之间添加分隔线
            if (index < messages.value.length - 1) {
              shareContent += `----------------------------------------\n\n`;
            }
          });
          
          // 复制到剪贴板
          navigator.clipboard.writeText(shareContent).then(() => {
            alert('聊天记录已复制到剪贴板，可以粘贴到其他地方分享');
          }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请重试');
          });
        } catch (error) {
          console.error('分享聊天记录失败:', error);
          alert('分享聊天记录失败，请重试');
        }
      };
      
      // 分享聊天记录
      const shareChat = copyChat;
      
      // 下载聊天记录
      const downloadChatAs = (format) => {
        if (messages.value.length === 0) {
          alert('没有可下载的聊天记录');
          return;
        }
        
        try {
          // 准备聊天记录内容
          let chatContent = '';
          
          // 添加聊天标题和时间
          const now = new Date();
          const formattedDate = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
          
          chatContent += `# AI 聊天记录\n\n`;
          chatContent += `生成时间: ${formattedDate}\n\n`;
          chatContent += `---\n\n`;
          
          // 添加每条消息
          messages.value.forEach((message, index) => {
            const sender = message.type === 'sent' ? '你' : 'AI';
            const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleString('zh-CN') : '';
            
            chatContent += `## ${sender} (${timestamp})\n\n`;
            chatContent += `${message.content}\n\n`;
            
            // 在消息之间添加分隔线
            if (index < messages.value.length - 1) {
              chatContent += `---\n\n`;
            }
          });
          
          // 创建 Blob 对象
          const blob = new Blob([chatContent], { type: `text/${format};charset=utf-8` });
          
          // 创建下载链接
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `AI聊天记录_${formattedDate.replace(/[/\\:]/g, '-')}.${format}`;
          
          // 触发下载
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          // 释放 URL 对象
          URL.revokeObjectURL(downloadLink.href);
        } catch (error) {
          console.error('下载聊天记录失败:', error);
          alert('下载聊天记录失败，请重试');
        }
      };
      
      // 切换下载选项
      const toggleDownloadOptions = () => {
        showDownloadOptions.value = !showDownloadOptions.value;
      };
      
      // 过滤聊天列表
      const filteredChatList = computed(() => {
        if (!chatSearch.value) return chatList.value;
        const searchText = chatSearch.value.toLowerCase();
        return chatList.value.filter(chat =>
          chat.title.toLowerCase().includes(searchText) ||
          chat.messages.some(msg => msg.content.toLowerCase().includes(searchText))
        );
      });
      
      // 初始化
      onMounted(() => {
        // 初始化Mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true
          }
        });
        
        loadChatList();
        if (chatList.value.length === 0) {
          createNewChat();
        } else {
          switchChat(chatList.value[0].id);
        }
        scrollToBottom();
      });
      
      return {
        messages,
        inputMessage,
        selectedCategory,
        categories,
        prompts,
        chatMessages,
        currentNav,
        navItems,
        roleSearch,
        chatSearch,
        filteredRoles,
        filteredChatList,
        showSidebar,
        chatList,
        currentChatId,
        messageInput,
        isSidebarResizing,
        showAboutModal,
        showDownloadOptions,
        sendMessage,
        selectPrompt,
        clearChat,
        refreshChat,
        openSettings,
        switchNav,
        selectRole,
        createNewChat,
        switchChat,
        deleteChat,
        clearAllChats,
        formatTime,
        startSidebarResize,
        regenerateMessage,
        copyMessage,
        openPromptEditor,
        openRoleEditor,
        renderMarkdown,
        openDiagramEditor,
        openEchartsEditor,
        openMarkdownEditor,
        openWorkflowEditor,
        openLinks,
        downloadChatAs,
        toggleDownloadOptions,
        copyChat,
        shareChat,
        copyCode,
        editCode
      };
    }
  });
  
  // 挂载Vue应用
  app.mount('#app');
}); 