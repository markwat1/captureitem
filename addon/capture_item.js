/*
  capture item on page
  copyright (c) 2021-22 Mark(Watanabe,Masayuki)
  addon for Firefox
*/

//console.log("Start content script");
// Global parameters
//console.log("Start Loding");
let patterns;
/*
  Default Patterns
  get 2 items on Mozilla page
  shift+Escape : image 1
  control+Escape : image 2
*/
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
      },\n\
      {\n\
          "url":"https://www.mozilla.org/ja/",\n\
          "type":"class",\n\
          "id":"mzp-c-billboard mzp-l-billboard-right",\n\
          "class_index":0,\n\
          "png":"firefox2.png",\n\
          "keyCode":"Escape",\n\
          "shift":false,\n\
          "alt":false,\n\
          "ctrl":true,\n\
          "meta":false\n\
      }\n\
  ]\n\
}\n';
/*
  Preference class
  capture setting preference
*/
class Preference {
// Default Parameters
    png = 'capture.png';
    findBy = '';
    id = '';
    keyCode = 'Escape';
    shift = true;
    alt = false;
    ctrl = false;
    meta = false;
    class_index = 0;
    constructor(png,findBy,id,keyCode,shift,alt,ctrl,meta,class_index){
        this.png = png;
        this.findBy = findBy;
        this.id = id;
        this.keyCode = keyCode;
        this.shift = shift;
        this.alt = alt;
        this.ctrl = ctrl;
        this.meta = meta;
        this.class_index = class_index;
    }
}
/*
  Effective Preferences on this page.
*/

let preferences = new Array(0);

// set function when loaded
window.addEventListener("popstate", onUrlChanged);
/* 
   register Message Listener
*/
browser.runtime.onMessage.addListener(messageListener);

/*
  get preferences from browser local storage
*/
var getting = browser.storage.local.get('pattern');
getting.then((res) => {
    let pattern = res.pattern;
    if(res.pattern == undefined){
        pattern = defaultPatterns;
    }
    let pat = JSON.parse(pattern);
    patterns = pat.patterns;
    onUrlChanged();
});
//console.log("End of initial");

// End of Initial code

/* 
   Effective Image Name
   overwrite from onkeydown function
*/

let effectivePng = "image.png";

/*
  message listener called on capture image executed in background 
*/
function messageListener(message){
    if(message.type == "image"){
//        console.log("Captured:",message);
        let elem = document.createElement("a");
        elem.href = message.uri;
        elem.download = effectivePng;
        elem.click();
    }else{
        if(message.type == "error"){
            console.log(`Message: ${message.message}`);
        }
    }
}

/*
  calc item offset from topleft of frame.
*/
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
/*
  called on url is changed
  reload preference and setup keydown event
*/

function onUrlChanged(){
    //    console.log("url changed: " + document.URL);
    preferences.splice(0);
    for(var p in patterns){
        let urlpat = new RegExp(patterns[p].url);
        if(urlpat.test(document.URL)){
//            console.log("URL Match: " + document.URL);
            //            document.body.style.border = "5px solid red";
//            window.removeEventListener("keydown", onKeyDown);
            window.addEventListener("keydown", onKeyDown);
            let findBy = patterns[p].type;
            let id = patterns[p].id;
            let class_index = 0;
            if(patterns[p].class_index){
                class_index = patterns[p].class_index;
            }
            let png = "";
            if(patterns[p].png){
                png = patterns[p].png;
            }else{
                png = "Capture.png";
            }
            let keyCode = "";
            if(patterns[p].keyCode){
                keyCode = patterns[p].keyCode
            }else{
                keyCode = 'Escape';
            }
            let shift = false;
            if(patterns[p].shift != void 0){
                shift = patterns[p].shift;
            }
            let alt = false;
            if(patterns[p].alt != void 0){
                alt = patterns[p].alt;
            }
            let ctrl = false;
            if(patterns[p].ctrl != void 0){
                ctrl = patterns[p].ctrl;
            }
            let meta = false;
            if(patterns[p].meta != void 0){
                meta = patterns[p].meta;
            }
            preferences.push(new Preference(png,findBy,id,keyCode,shift,alt,ctrl,meta,class_index));
        }
    }
}
/*
  called on key down 
  calc frame offset and send message what execute capture to background
*/
function onKeyDown(e) {
//    console.log("keycode:",e.code);
    preferences.forEach(function(p){
        if( e.code == p.keyCode &&
            e.shiftKey == p.shift &&
            e.altKey == p.alt &&
            e.ctrlKey == p.ctrl &&
            e.metaKey == p.meta
          ) {
            let elem;
            switch(p.findBy){
            case 'id':
                elem = document.getElementById(p.id);
                break;
            case 'class':
                elem = document.getElementsByClassName(p.id)[p.class_index];
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
            effectivePng = p.png;
            var sending = browser.runtime.sendMessage({rect:{x:offset.left,y:offset.top,width:width,height:height}});
            sending.then(messageListener, onError);
        }
    })
}

/*
  called on error
  logging only
*/

function onError(error) {
    console.log(`Error: ${error}`);
}
