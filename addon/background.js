browser.runtime.onMessage.addListener(notify);

let tabId = 0;

function onCaptured(imageUri) {
    browser.tabs.sendMessage(tabId,{type:"image",uri:imageUri});
}

function onError(error) {
    browser.tabs.sendMessage(tabId,{message:"onError"});
}

function notify(message, sender, sendResponse){
    responseFunc = sendResponse;
    var capturing = browser.tabs.captureTab(message);
    capturing.then(onCaptured, onError);
    tabId = sender.tab.id;
    sendResponse({message:"Capturing"});
}


