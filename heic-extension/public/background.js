chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "convertToPDF",
        title: "Convert Image to PDF",
        contexts: ["image"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "convertToPDF") {
        chrome.tabs.sendMessage(tab.id, { action: "convertToPDF", imageUrl: info.srcUrl });
    }
});