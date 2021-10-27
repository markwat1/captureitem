//console.log("Start content script");
let findBy = '';
let id = '';
let png = 'capture.png';
let keyCode = 'Escape';
let shift = true;
let alt = false;
let ctrl = false;
let meta = false;

function setup(){
//    console.log("addEventListener");
    window.addEventListener("keydown", onKeyDown);
}

//document.body.style.border = "5px solid red";
browser.runtime.onMessage.addListener(messageListener);
var getting = browser.storage.local.get('pattern');
getting.then((res) => {
//    console.log(res.pattern);
    let pat = JSON.parse(res.pattern);
    for(var p in pat.patterns){
//        console.log(pat.patterns[p]);
        let urlpat = new RegExp(pat.patterns[p].url);
        if(urlpat.test(document.URL)){
//            console.log("pattern match:" + pat.patterns[p].url);
            findBy = pat.patterns[p].type;
            id = pat.patterns[p].id;
            png = pat.patterns[p].png;
            keyCode = pat.patterns[p].keyCode;
            shift = pat.patterns[p].shift;
            alt = pat.patterns[p].alt;
            ctrl = pat.patterns[p].ctrl;
            meta = pat.patterns[p].meta;
            setup();
            break;
        }
    }
    if(findBy == ''){
//        console.log("Not Match");
    }
});

function messageListener(message){
    if(message.type == "image"){
//        console.log("Download Image");
        let elem = document.createElement("a");
        elem.href = message.uri;
        elem.download = png;
        elem.click();
    }else{
        console.log("Message  " + message);
    }
}

function getOffset(elem){
    let offsetX = 0;
    let offsetY = 0;
    let e = elem;
    while(e){
        offsetX = offsetX + e.offsetLeft;
        offsetY = offsetY + e.offsetTop;
        e = e.offsetParent;
    }
    return {left:offsetX,top:offsetY};
}

//console.log("onKeyDown");

function onKeyDown(e) {
//    console.log("KeyDown :" + e.code);
    if( e.code == keyCode &&
        e.shiftKey == shift &&
        e.altKey == alt &&
        e.ctrlKey == ctrl &&
        e.metaKey == meta
      ) {
        let elem;
        switch(findBy){
        case 'id':
//            console.log("get Element ById");
            elem = document.getElementById(id);
            break;
        case 'class':
//            console.log("get Element ByClassName");
            elem = document.getElementsByClassName(id)[0];
            break;
        }
        let offset = getOffset(elem);
        let width = elem.offsetWidth;
        if(width == 0){
            width = 500;
        }
        let height = elem.offsetHeight;
        if(elem.offsetHeight == 0){
            height = 500;
        }
//        console.log(`Rect:(${offset.left},${offset.top},${width},${height})`);
        var sending = browser.runtime.sendMessage({rect:{x:offset.left,y:offset.top,width:width,height:height}});
        sending.then(messageListener, onError);
    }
}


function onError(error) {
    console.log(`Error: ${error}`);
}
