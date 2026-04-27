// 获取 DOM 元素
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const knowledgeContent = document.getElementById('knowledgeContent');

// 模拟知识库数据
const knowledgeBase = [
    {
        id: 1,
        title: '产品介绍',
        content: 'QuickSearch 是一个智能问答系统，提供高效的知识库管理和智能问答服务。'
    },
    {
        id: 2,
        title: '使用指南',
        content: '在输入框中输入问题，系统会自动匹配相关知识并给出回答。'
    },
    {
        id: 3,
        title: '常见问题',
        content: 'Q: 如何添加新的知识？\nA: 在知识库管理页面可以添加新的知识条目。'
    }
];

// 初始化知识库显示
function initKnowledgeBase() {
    knowledgeContent.innerHTML = knowledgeBase.map(item => `
        <div class="knowledge-item" data-id="${item.id}">
            <h3>${item.title}</h3>
            <p>${item.content}</p>
        </div>
    `).join('');
}

// 添加消息到聊天界面
function addMessage(content, isUser = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const time = new Date().toLocaleTimeString();
    messageDiv.innerHTML = `
        <div class="message-content">${content}</div>
        <div class="message-time">${time}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 处理发送消息
function handleSendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        // 添加用户消息
        addMessage(message, true);
        
        // 清空输入框
        messageInput.value = '';
        
        // 模拟机器人回复
        setTimeout(() => {
            const reply = generateReply(message);
            addMessage(reply, false);
        }, 1000);
    }
}

// 生成回复
function generateReply(message) {
    // 简单的关键词匹配
    if (message.includes('你好') || message.includes('hi') || message.includes('hello')) {
        return '你好！我是 QuickSearch 智能助手，有什么可以帮你的吗？';
    } else if (message.includes('帮助') || message.includes('help')) {
        return '你可以问我任何问题，我会尽力帮你解答。';
    } else {
        return '我理解你的问题，正在查找相关资料...';
    }
}

// 自动调整输入框高度
function adjustTextareaHeight() {
    messageInput.style.height = 'auto';
    messageInput.style.height = messageInput.scrollHeight + 'px';
}

// 事件监听
messageInput.addEventListener('input', adjustTextareaHeight);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});
sendButton.addEventListener('click', handleSendMessage);

// 初始化
initKnowledgeBase(); 