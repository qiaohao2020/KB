document.getElementById('openSidebar').addEventListener('click', async () => {
  // 获取当前标签页
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // 打开侧边栏
  chrome.sidePanel.open({ windowId: tab.windowId });
}); 