
var request = new XMLHttpRequest();
var base_url = 'https://dev.api.shopinsync.com'
if(window.shopInSync.env == "staging"){
  base_url = 'https://staging.api.shopinsync.com'
}else if(window.shopInSync.env == "production"){
  var market = window.shopInSync.market;
  var base = market.split("_")[1]+'-'+market.split("_")[0]
  base_url = 'https://'+base+'.api.shopinsync.com'
}
var url = base_url+'/remote/administration/sdk_version'

request.open('POST', url, true);
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
request.setRequestHeader("Cache-Control", "no-cache");
request.setRequestHeader("InsyncReferer", window.shopInSync.refererDomain);
if (window.shopInSync.hostedPageRef){
  request.setRequestHeader("InsynchostedPageRef", window.shopInSync.hostedPageRef);
}
request.onload = function () {
  console.log("on load")

  if (request.status == 200) {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if(data && data["result"]){
      if(typeof data["result"] === "string"){
        window.shopInSync.sdk_version = data["result"];
      }else{
        window.shopInSync.clientToken = data["result"]["secret"];
        window.shopInSync.sdk_version = data["result"]["version"];
        if(data["result"]["client_style_guide"])window.shopInSync.clientStyleGuide = data["result"]["client_style_guide"];
      }
      function loadScript(d, s, id,src){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = src;
         fjs.parentNode.insertBefore(js, fjs);
       }
       var src = 'https://dbrd449anfbv4.cloudfront.net/bundle'+window.shopInSync.sdk_version+'.js';
       loadScript(document, 'script', 'sis-jssdk',src);
    }

  } else {
    console.log('Error'+request.status);
  }
}
var appId;
if(window.shopInSync.app_id) appId = window.shopInSync.app_id; // TO BE REMOVED LATER
if(window.shopInSync.appId) appId = window.shopInSync.appId;

var triggerPoint = '';
if(typeof window.shopInSync.triggerPoint !== "undefined")triggerPoint = window.shopInSync.triggerPoint;

var deviceType = typeof window.shopInSync.deviceType !== "undefined" ? window.shopInSync.deviceType : "";

request.send('source=web&market='+window.shopInSync.market+'&env='+window.shopInSync.env+'&app_id='+appId+'&trigger_point='+triggerPoint+'&device_type='+deviceType);


