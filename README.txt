configuration
pattern.json
----------------------
{
  "patterns":[
      {
          "url":"https://www.mozilla.org/ja/",
          "type":"class",
          "id":"c-fxpromo-title",
          "class_index": 0,
          "png":"firefoxaddon.png",
          "keyCode":"Escape",
          "shift":true,
          "alt":false,
          "ctrl":false,
          "meta":false
      },
      {
          "url":"https://www.google.com/",
          "type":"id",
          "id":"ctaCanvas",
          "class_index": 0,
          "png":"google.png",
          "keyCode":"Escape",
          "shift":true,
          "alt":false,
          "ctrl":false,
          "meta":false
      }
  ]
}
---------------------
url: URL pattern (regular Expression)
type: id/class
id: element id
class_index: index of elements matched by class
png: save file name(png)
keyCode: trigger key
shift,alt,ctrl,meta: required modifier
