function onStored(res){
    
}

function saveOptions(e) {
    let pattern = document.getElementById("pattern").value;
    try{
        JSON.parse(pattern);
    } catch (e){
        alert("JSON Error:" + e.message);
    }
    let setting = browser.storage.local.set({
        'pattern':pattern
    });
    setting.then(onStored,onError);
    e.preventDefault();
}
function onError(e){
    alert("Error:"+e);
}

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

function restoreOptions() {
    var getting = browser.storage.local.get("pattern");
    getting.then((res) => {
        if(res.pattern){
            document.getElementById("pattern").value = res.pattern;
        }else{
            document.getElementById("pattern").value = defaultPatterns;
        }
    },(e) => {
        console.log("Default Patterns");
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
