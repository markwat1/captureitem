function onStored(res){
    
}

function saveOptions(e) {
    let pattern = document.getElementById("pattern").value;
    let setting = browser.storage.local.set({
        'pattern':pattern
    });
    setting.then(onStored,onError);
    e.preventDefault();
}
function onError(e){
    alert("Error:"+e);
}

function restoreOptions() {
    var getting = browser.storage.local.get("pattern");
    getting.then((res) => {
        document.getElementById("pattern").value = res.pattern;
    },(e) => {
        alert("catnnot get storage");
    });
    
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
