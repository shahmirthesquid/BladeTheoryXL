function insyncGetUniqueTabId (insyncMarket, insyncEnv){
  let uuid = "insyncai_tab_uuid";
  if(insyncEnv != "production")uuid += "_" + insyncMarket + "_" + insyncEnv;
  let insyncTabId = sessionStorage.getItem(uuid);
  if(typeof insyncTabId == "undefined" || insyncTabId == "" || insyncTabId == null){
    insyncTabId = (Date.now() + Math.round(((Math.random()+1)*100000000)) + Date.now()).toString();
    sessionStorage.setItem(uuid, insyncTabId);
  }
  return insyncTabId;
}

function insyncGetUniqueUserId (insyncMarket, insyncEnv, insyncExpiryInDays){
  let cookieName = "insyncai_chat_uuid";
  if(insyncEnv != "production")cookieName += "_" + insyncMarket + "_" + insyncEnv;
  let insyncUserId = insyncGetCookie(cookieName);
  if(typeof insyncUserId == "undefined" || insyncUserId == ""){
    insyncUserId = (Date.now() + Math.round(((Math.random()+1)*100000000)) + Date.now()).toString();
    insyncSetCookie(cookieName, insyncUserId, insyncExpiryInDays);
  }
  return insyncUserId;
}

function insyncSetCookie(cookieName, cookieValue, expiryInDays){
  const d = new Date();
  d.setTime(d.getTime() + (expiryInDays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  let baseDomain = window.location.hostname.split(".").slice(window.location.hostname.split(".").length-2).join(".");
  let c = cookieName + "=" + cookieValue + ";" + expires + ";domain=." + baseDomain + ";path=/"+";secure";
  document.cookie = c;
}

function insyncGetCookie(cookieName) {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      console.log("Got cookie");
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function insyncSetChatEnv(args){
  let insyncDomain = 'https://dbrd449anfbv4.cloudfront.net';
  let insyncAppId;
  if(args.insyncEnv == "development"){
      insyncAppId = args.insyncAppIdDev;
  }else if(args.insyncEnv == "staging"){
      insyncAppId = args.insyncAppIdStage;
  }else if(args.insyncEnv == "production"){
      insyncAppId = args.insyncAppIdProd;
  }
  if(!args.hasOwnProperty("insyncTriggerPoint")){
      args.insyncTriggerPoint = window.location.hostname.split(".").slice(window.location.hostname.split(".").length-2)[0]
  }
  if((!args.hasOwnProperty("insyncUserId")) || (args.insyncUserId == "" || typeof args.insyncUserId == "undefined")){
    if(!args.hasOwnProperty("insyncUserIdExpiryInDays") || args.insyncUserIdExpiryInDays == ""){
      args.insyncUserIdExpiryInDays = 3;
    }
    args.insyncUserId = insyncGetUniqueUserId(args.insyncMarket, args.insyncEnv, args.insyncUserIdExpiryInDays);
  }

  let insyncSource = "web";
  if(args.hasOwnProperty("insyncSource")){
    insyncSource = args.insyncSource;
  }
  
   ////////////// CHATBOT CONFIG //////////////

  let insyncChatbotConfig = {
      userId: args.insyncUserId,
      mobile: false,
      market: args.insyncMarket,
      env: args.insyncEnv,
      appId: insyncAppId,
      source: insyncSource,
      triggerPoint: args.insyncTriggerPoint,
      hostedPageRef: args.insyncHostedPageRef,
      trackingEvents: args.insyncTrackingEvents,
      uniqueTabId: insyncGetUniqueTabId(args.insyncMarket, args.insyncEnv),
      contextParams: {
          isIframe: true,
          iframeParentWidth: window.innerWidth,
          iframeParentHeight: window.innerHeight,
          customCssSrc: args.insyncCustomCssSrc
      }
  }

   //////////////////////////////////////////
   if(document.title){
    insyncChatbotConfig.contextParams.pagetitle = document.title;
   }

  // Merging insyncContextParams
  if(args.hasOwnProperty("insyncContextParams")){
    insyncChatbotConfig.contextParams = {...insyncChatbotConfig.contextParams, ...args.insyncContextParams};
  }

  // Trigger auto open if insyncAutoOpenTimerInSecs is configured or chatAutoOpenTime is being passed in the URL
  var insyncAutoOpenTimerVar;
  let insyncAutoOpen = function(insyncAutoOpenTimerInSecs){
    
    // Configured insyncAutoOpenTimerInSecs on page
    if(typeof insyncAutoOpenTimerInSecs == "undefined" && args.hasOwnProperty("insyncAutoOpenTimerInSecs")){
      insyncAutoOpenTimerInSecs = args.insyncAutoOpenTimerInSecs;
    }

    // Configured chatAutoOpenTime on page URL
    if(typeof insyncAutoOpenTimerInSecs == "undefined" && args.hasOwnProperty("insyncHostedPageRef") && args.insyncHostedPageRef.includes("chatAutoOpenTime=")){
      let chatAutoOpenTimeStr = "chatAutoOpenTime=";
      insyncAutoOpenTimerInSecs = (parseInt(args.insyncHostedPageRef.split(chatAutoOpenTimeStr)[1].split("&")[0]) > 0 ? parseInt(args.insyncHostedPageRef.split(chatAutoOpenTimeStr)[1].split("&")[0]) : null);
    }

    if(insyncAutoOpenTimerInSecs){
      insyncAutoOpenTimerVar = setTimeout(function() {
        insyncOpenChat('OpenChat', 'timer', args)
      }, insyncAutoOpenTimerInSecs*1000);
    }
  }
  // Google Tracking Events Wrapper
  let trackingEventsWrapper = function(eventName, data=null){
    if(typeof ((insyncChatbotConfig.trackingEvents || {}).events) != "undefined"){
      fireTrackingEvents(insyncChatbotConfig.trackingEvents, eventName, data);
    }
  }

  // Google Tracking events
  let fireTrackingEvents = function(insyncTrackingEvents, eventName, data){
    let events = insyncTrackingEvents.events;
    if(events.hasOwnProperty(eventName)){
      if(insyncTrackingEvents.target == "GoogleDataLayer"){
        let d = {event: events[eventName].eventName};
        if(events[eventName].hasOwnProperty("dataKey"))d[events[eventName].dataKey] = data;
        console.log("Push ", d);
        if(window.hasOwnProperty("dataLayer")){
          window.dataLayer.push(d);
        }else{
          console.warn("window.hasOwnProperty(dataLayer) is false");
        }
      }
    }
  }

  //Send Tracking data
  let insyncTrackData = function(data) {
    // Make sure you are sending a string, and to stringify JSON
    let dict = {type: "TrackEvents", eventsData: JSON.stringify(data)};
    insyncIframeEl.contentWindow.postMessage(dict, insyncDomain);
  };
  
  let loadScript = function(d, s, id, src, callback){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = src;
      js.async = true;
      js.onload = callback;
      fjs.parentNode.insertBefore(js, fjs);
  }

  // Get iFrame element
  let insyncIframeEl;
  let counter = 0;
  let insyncIframeElFn = function() {
    insyncIframeEl = document.getElementById(args.insyncIframeId);
    if(!insyncIframeEl && counter <= 50){
      setTimeout(function(){
        insyncIframeElFn();
        counter = counter + 1;
        console.log("trying again. counter: ", counter);
      }, 200)
    }
  };
  if(!insyncIframeEl)insyncIframeElFn();


  // Triggered on the click of chat icon
  let insyncOpenChat = function(type, triggeredBy="user", args={}) {
    // Close preview module button if available on screen 
    if(typeof insyncChatPreviewModuleCloseWindow != "undefined")insyncChatPreviewModuleCloseWindow();
    
    // Fire custom events (like GTM, etc) if expected
    trackingEventsWrapper("ChatIconClicked");

    if(typeof insyncAutoOpenTimerVar != "undefined")clearTimeout(insyncAutoOpenTimerVar); //remove setTimout if assigned
    if(insyncChatbotConfig.hasOwnProperty("styleGuide")){
      insyncIframeEl.style.height = insyncChatbotConfig.styleGuide.screenHeight.toString()+"px";
      insyncIframeEl.style.width = insyncChatbotConfig.styleGuide.screenWidth.toString()+"px";
      insyncIframeEl.style.right = insyncChatbotConfig.styleGuide.right.toString()+"px";
      if(insyncChatbotConfig.styleGuide.left && insyncChatbotConfig.styleGuide.left != "auto")insyncIframeEl.style.left = insyncChatbotConfig.styleGuide.left.toString()+"px";
      insyncIframeEl.style.bottom = insyncChatbotConfig.styleGuide.bottom.toString()+"px";
      
      // Make sure you are sending a string, and to stringify JSON
      let dict = {type: type, userId: insyncChatbotConfig.userId, triggeredBy: triggeredBy};
      // Send message if user has typed something in the chat preview button module or extra args like skip chat window open
      dict = {...dict, ...args}
      insyncIframeEl.contentWindow.postMessage(dict, insyncDomain);

      // Fire custom events (like GTM, etc) if expected
      trackingEventsWrapper("OpenChat");
      
    }
  };

  //Send Session data
  let insyncSendSessionData = function(data) {
    // Make sure you are sending a string, and to stringify JSON
    let dict = {type: "SendSessionData", sessionData: JSON.stringify(data)};
    insyncIframeEl.contentWindow.postMessage(dict, insyncDomain);
  
  };

  //Show Insync Chat Button
  let insyncShowChatBtn = function(button, type){
    if(button){
      button.style.display = "block";
      if(type =='ShowChatPreviewModuleBtn'){
        button.style.animation = "none";
      }
    }else{
      console.warn("Element with insyncChatIconId is missing!");
    }
  }

  // Send Event & data
  let insyncSendEvent = function(type, args) {
    // Make sure you are sending a string, and to stringify JSON
    let dict = {type: type, args: args};
    insyncIframeEl.contentWindow.postMessage(dict, insyncDomain);
  
  };

  // Function Assignment
  insyncSetChatEnv.openChat = insyncOpenChat;
  insyncSetChatEnv.sendSessionData = insyncSendSessionData;
  insyncSetChatEnv.sendEvent = insyncSendEvent;

  ////////////// Receive Messages from iFrame //////////////
  window.addEventListener("message", insyncReceiveMessage, false);

  function insyncReceiveMessage(event) {
    //console.log("event.origin: "+event.origin)
    //Validating domain
    if (event.origin !== insyncDomain)
    return;
    
    // Event fired on the click of SDK's minimize icon to minimize iframe window
    if(event.data.type =='CloseChat'){
        insyncIframeEl.style.height = "0px";
        insyncIframeEl.style.width = "0px";
        insyncIframeEl.style.borderRadius = "0px";
        insyncIframeEl.style.boxShadow = "none";

        // Fire custom events (like GTM, etc) if expected
        trackingEventsWrapper("CloseChat");
    }

    // Event fired to display the chat icon as SDK is ready 
    if((event.data.type =='ShowChatBtn' || event.data.type =='ShowChatPreviewModuleBtn') && args.hasOwnProperty('insyncChatIconId')){
        if(typeof insyncChatbotConfig.styleGuide == 'undefined')insyncChatbotConfig.styleGuide = {};
        insyncChatbotConfig.styleGuide = event.data;
        let button = document.getElementById(args.insyncChatIconId);

        // Event fired to display the new chat icon
        //let chatPreviewModuleButton;
        if(event.data.type =='ShowChatPreviewModuleBtn'){
          // Load script
          let src = "https://dbrd449anfbv4.cloudfront.net/insync_webchat_"+insyncChatbotConfig.env+"_with_chat_preview_btn.js";
          loadScript(document, 'script', 'insync-webchat-js',src, function() {
            // Function to be called once the script is loaded
            insertChatPreviewModuleScript(insyncChatbotConfig, insyncIframeEl, button, insyncDomain);
            insyncSetChatEnv.closeChatPreviewModule = insyncCloseChatPreviewModule;
            insyncSetChatEnv.trackData = insyncTrackData;
            insyncShowChatBtn(button, event.data.type);
          
          });
        }else{
          // Event fired to display the default chat icon
          insyncShowChatBtn(button, event.data.type);
          // Override the autoOpenTimer from server based on config
          insyncAutoOpen(insyncChatbotConfig.styleGuide.autoOpenTimerOverride);
        }
    }

     // Event fired to position the chat icon 
     if(event.data.type == "StyleChatIcon"){
      if(event.data.chatIconStyle){
        let button = document.getElementById(args.insyncChatIconId);
        if(button){
          if(event.data.chatIconStyle.hasOwnProperty("chat_icon_bottom"))button.style.bottom = event.data.chatIconStyle.chat_icon_bottom.toString()+"px";
          if(event.data.chatIconStyle.hasOwnProperty("chat_icon_left")){
            button.style.left = event.data.chatIconStyle.chat_icon_left.toString()+"px";
          }else if(event.data.chatIconStyle.hasOwnProperty("chat_icon_right")){
            button.style.right = event.data.chatIconStyle.chat_icon_right.toString()+"px";
          }
        }
      }
  }

    // Event fired to match the style of iFrame window with SDK 
    if(event.data.type == "StyleIframe"){
        insyncIframeEl.style.borderRadius = insyncChatbotConfig.styleGuide.chatBoxBorderRadius.toString()+"px";
        insyncIframeEl.style.boxShadow = insyncChatbotConfig.styleGuide.chatBoxShadow;
    }

    // Event fired when a URL is clicked to be opened outside
    if(event.data.type == "OpenUrl"){
        window.open(event.data.url);
    }

    // Event fired to simulate a click on parent's page btn
    if(event.data.type == "ClickBtn"){
      if(event.data.dict.className){
        let elements = document.getElementsByClassName(event.data.dict.className);
        if(elements)elements[0].click();
      }
      if(event.data.dict.id){
        let element = document.getElementById(event.data.dict.id);
        if(element)element.click();
      }
    }

    // Event fired when a email typed by the user
    if(event.data.type == "UserEmailCaptured"){
      trackingEventsWrapper(event.data.type, event.data.trackingEventData);
    }
    
    // Event fired when iFrame's content is ready
    if(event.data.type == "IframeContentReady"){
        // Send ChatbotConfig to load SDK
        let dict = {type: "ChatbotConfig", chatbotConfig: insyncChatbotConfig};
        insyncIframeEl.contentWindow.postMessage(dict, insyncDomain);
    }
  }
}
