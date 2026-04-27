// 内容脚本，用于与网页交互
console.log('聊天侧边栏扩展已加载');

// 获取页面主要内容
function getPageContent() {
    // 获取所有段落文本
    const paragraphs = Array.from(document.getElementsByTagName('p'))
        .map(p => p.textContent.trim())
        .filter(text => text.length > 0);
    
    // 获取所有标题
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
        .map(h => h.textContent.trim())
        .filter(text => text.length > 0);
    
    return {
        paragraphs,
        headings,
        url: window.location.href,
        title: document.title
    };
}

// 监听来自侧边栏的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        const content = getPageContent();
        sendResponse(content);
    }
}); 