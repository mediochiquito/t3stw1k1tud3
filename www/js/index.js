/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
function es_touch(){

        try {  
            document.createEvent("TouchEvent");  
            return true;  
        } catch (e) {  
            return false;  
        }  
            
}

var app = {

    isDeviceSupported: false,

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    cerrar:function(){
        alert('cerrandoooooo')
    },
    /**
     *  This function extracts an url parameter
     */
    getUrlParameterForKey: function(url, requestedParam) {
        requestedParam = requestedParam.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + requestedParam + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);

        if (results == null)
            return "";
        else {
            var result = decodeURIComponent(results[1]);
            return result;
        }
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {

        document.addEventListener('deviceready', this.onDeviceReady);
       
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        app.receivedEvent('deviceready');

        // check if the current device is able to launch ARchitect Worlds
        try{
            
            app.wikitudePlugin = cordova.require("com.wikitude.phonegap.WikitudePlugin.WikitudePlugin")                     
            app.wikitudePlugin.isDeviceSupported(app.onDeviceSupportedCallback, app.onDeviceNotSupportedCallback);
            
        }catch(e){}
       
        var btn_ver = new Boton2Frames("img/btn_ver.png", 200, 100,  loadAR)
        btn_ver.main.id = 'btn_ver';
        $('body').append(btn_ver.main)
      

    },

    // --- Wikitude Plugin ---
    /**
     *  This function gets called if you call "document.location = architectsdk://" in your ARchitect World
     *  @param url The url which was called in ARchitect World
     */
    // A callback which gets called if the device is able to launch ARchitect Worlds
    onDeviceSupportedCallback: function() {
        app.isDeviceSupported = true;

      
    },
    
    // A callback which gets called if the device is not able to start ARchitect Worlds
    onDeviceNotSupportedCallback: function() {
       alert('Unable to launch ARchitect Worlds on this device');
    }, 

    loadARchitectWorld: function(samplePath) {

      
        if (app.isDeviceSupported) {

            app.wikitudePlugin.loadARchitectWorld(samplePath);
            app.wikitudePlugin.setOnUrlInvokeCallback(app.onClickInARchitectWorld);
    
        } else {
            alert("Device is not supported");
        }
    },

    onClickInARchitectWorld: function(url) {
       
        if (app.getUrlParameterForKey(url, 'text')) {
            alert("you clicked on a label with text: " + app.getUrlParameterForKey(url, 'text'));
        } else if (app.getUrlParameterForKey(url, 'action')) {
           
            //app.wikitudePlugin.onBackButton();
            app.wikitudePlugin.hide();
        }  else if (app.getUrlParameterForKey(url, 'id')) {
           
          // alert(app.getUrlParameterForKey(url, 'id'))

        } else if (app.getUrlParameterForKey(url, 'close')) {
           
            //app.wikitudePlugin.hide();
        }
    },    
    
    onScreenCaptured: function (absoluteFilePath) {
        alert("snapshot stored at:\n" + absoluteFilePath);
    },
    
    onScreenCapturedError: function (errorMessage) {
        alert(errorMessage);
    },
    
    onUrlInvoke: function (url) {

       if (url.indexOf('captureScreen') > -1) {
            app.wikitudePlugin.captureScreen(true, null, app.onScreenCaptured, app.onScreenCapturedError);
        } else {
            alert(url + "not supported");
        }
                                                  
    },

    // --- End Wikitude Plugin ---

    // Update DOM on a Received Event
    receivedEvent: function(id) {
      
    },
    report: function(id) {
        console.log("report:" + id);
    }
};


function loadARfromUrl(url) {
    app.loadARchitectWorld(url);
}   
    
function loadAR(){

    app.loadARchitectWorld('www/world/index.html');
    navigator.geolocation.getCurrentPosition(onLocationUpdated,  onLocationError);
 }



/* - - - - - -  relevant for sample 4.3 only  - BEGIN */

/* this is a dummy implementation to create poi-data, which are passed over to JS / Wikitude SDK on first location update */
/*function onLocationUpdated(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var altitude = position.coords.altitude;
    var placesAmount = 10;
    var poiData = [];
    
    // creates dummy poi-data around given lat/lon
    for (var i=0; i< placesAmount; i++) {
        poiData.push({ 'id': (i+1), 'longitude': longitude + 0.001 * ( 5 - getRandomInt(1,10) ), 'latitude' : latitude + 0.001 * (5 - getRandomInt(1,10)), 'description': 'This is the description of POI#'+(i+1), 'altitude' : 100.0, 'name': 'POI#'+(i+1)})
    }
    
    // inject POI data in JSON-format to JS
    app.wikitudePlugin.callJavaScript( "World.loadPoisFromJsonData(" + JSON.stringify( poiData ) +");");
}

function onLocationError(error) {
    alert("Not able to fetch location.");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}*/

/* - - - - - -  relevant for sample 4.3 only  - END */


app.initialize();
