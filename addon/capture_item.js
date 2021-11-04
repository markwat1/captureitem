//console.log("Start content script");
let patterns;
let png = 'capture.png';
let defaultPatterns =
'{\n\
  "patterns":[\n\
      {\n\
          "url":"https://www.mozilla.org/ja/",\n\
          "type":"class",\n\
          "id":"c-fxpromo-title",\n\
          "class_index":0,\n\
          "png":"firefox.png",\n\
          "keyCode":"Escape",\n\
          "shift":true,\n\
          "alt":false,\n\
          "ctrl":false,\n\
          "meta":false\n\
      }\n\
  ]\n\
}\n';

window.addEventListener("keydown", onKeyDown);

//document.body.style.border = "5px solid red";
browser.runtime.onMessage.addListener(messageListener);
var getting = browser.storage.local.get('pattern');
getting.then((res) => {
    let pattern = res.pattern;
    if(res.pattern == undefined){
        pattern = defaultPatterns;
    }
    let pat = JSON.parse(pattern);
    patterns = pat.patterns;
});

function messageListener(message){
    if(message.type == "image"){
        let elem = document.createElement("a");
        elem.href = message.uri;
        elem.download = png;
        elem.click();
    }else{
        if(message.type == "error"){
            console.log(`Message: ${message.message}`);
        }
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

function onKeyDown(e) {
    let findBy = '';
    let id = '';
    let keyCode = 'Escape';
    let shift = true;
    let alt = false;
    let ctrl = false;
    let meta = false;
    let class_index = 0;
    for(var p in patterns){
        let urlpat = new RegExp(patterns[p].url);
        if(urlpat.test(document.URL)){
            findBy = patterns[p].type;
            id = patterns[p].id;
            if(patterns[p].class_index){
                class_index = patterns[p].class_index;
            }
            if(patterns[p].png){
                png = patterns[p].png;
            }else{
                png = "Capture.png";
            }
            if(patterns[p].keyCode){
                keyCode = patterns[p].keyCode
            }else{
                keyCode = 'Escape';
            }
            if(patterns[p].shift != void 0){
                shift = patterns[p].shift;
            }else{
                shift = false;
            }
            if(patterns[p].alt != void 0){
                alt = patterns[p].alt;
            }else{
                alt = false;
            }
            if(patterns[p].ctrl != void 0){
                ctrl = patterns[p].ctrl;
            }else{
                ctrl = false;
            }
            if(patterns[p].meta != void 0){
                meta = patterns[p].meta;
            }else{
                meta = false;
            }
            if( e.code == keyCode &&
                e.shiftKey == shift &&
                e.altKey == alt &&
                e.ctrlKey == ctrl &&
                e.metaKey == meta
              ) {
                let elem;
                switch(findBy){
                case 'id':
                    elem = document.getElementById(id);
                    break;
                case 'class':
                    elem = document.getElementsByClassName(id)[class_index];
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
                var sending = browser.runtime.sendMessage({rect:{x:offset.left,y:offset.top,width:width,height:height}});
                sending.then(messageListener, onError);
                break;
            }
        }
    }
}

function onError(error) {
    console.log(`Error: ${error}`);
}
