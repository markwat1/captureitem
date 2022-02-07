/*
  background process for capture_item
*/
browser.runtime.onMessage.addListener(notify);

let tabId = 0;

function onCaptured(imageUri) {
    browser.tabs.sendMessage(tabId,{type:"image",uri:imageUri});
}

function onError(error) {
    browser.tabs.sendMessage(tabId,{type:"error",message:"capturing Error"});
}

function onSearchError(error) {
    browser.tabs.sendMessage(tabId,{type:"error",message:"bookmark search Error"});
}

function onFound(bookmarkItems){
    if(bookmarkItems.length == 0){
        browser.tabs.sendMessage(tabId,{type:"notfound",message:"bookmark notfound"});
    } else {
        browser.tabs.sendMessage(tabId,{type:"title", message: bookmarkItems[0].title});
    }
}

function notify(message, sender, sendResponse){
    tabId = sender.tab.id;
    if(message.rect){
        var capturing = browser.tabs.captureVisibleTab(message);
        capturing.then(onCaptured, onError);
    }else if(message.url){
        var searching = browser.bookmarks.search({url: message.url});
        searching.then(onFound, onSearchError);
    }
}


