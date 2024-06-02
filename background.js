chrome.action.onClicked.addListener((tab) => {
    const url = 'https://4k.devok.store/#/home;url=' + encodeURIComponent(tab.url) + ';audioOnly=false';
    chrome.storage.local.get(['windowId'], (result) => {
        if (result.windowId) {
            chrome.windows.get(result.windowId, {populate: true}, (window) => {
                if (chrome.runtime.lastError) {
                    createWindow(url);
                } else {
                    // Update the first tab to the new URL
                    chrome.tabs.update(window.tabs[0].id, { url: url }, (tab) => {
                        // Add a listener for the tabs.onUpdated event
                        chrome.tabs.onUpdated.addListener(function listener (tabId, changeInfo, tab) {
                            if (tabId === tab.id && changeInfo.status === 'complete') {
                                // The tab has finished loading, reload it
                                chrome.tabs.reload(tabId);
                                // Remove this listener
                                chrome.tabs.onUpdated.removeListener(listener);
                            }
                        });
                    });
                }
            });
        } else {
            createWindow(url);
        }
    });
});

function createWindow(url) {
    chrome.windows.create({ url: url, focused: false }, (window) => {
        chrome.storage.local.set({ windowId: window.id });
    });
}