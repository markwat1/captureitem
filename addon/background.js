browser.runtime.onMessage.addListener(notify);

let tabId = 0;

function onCaptured(imageUri) {
    browser.tabs.sendMessage(tabId,{type:"image",uri:imageUri});
}

function onError(error) {
    browser.tabs.sendMessage(tabId,{type:"error",message:"capturing Error"});
}

function notify(message, sender, sendResponse){
    tabId = sender.tab.id;
    responseFunc = sendResponse;
    var capturing = browser.tabs.captureVisibleTab(message);
    capturing.then(onCaptured, onError);
    sendResponse({message:"Capturing"});
}


