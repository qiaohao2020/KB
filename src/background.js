// 监听扩展图标点击事件
chrome.action.onClicked.addListener((tab) => {
  // 打开侧边栏
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// 初始化侧边栏
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }); 