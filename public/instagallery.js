// Exports
module.exports = {
    hlc: hlc,
    hlm: hlm
};

// Includes
$ = require("jquery");
require("./jquery.gridder.min.js");

// Constants
const MAX_RETRY = 5;      // Maximum number of retries
const RETRY_DELAY = 5000; // Retry delay (ms)

// Globals
var rawList = []; // Current raw list of gallery elements
var jn = 0;       // Current request number
var gTitle = "";  // Gallery title

// Hyperlink click
function hlc(e){
    // Copy inner contents to clipboard
    e.firstChild.innerHTML = '';
    var r = document.createRange();
    r.selectNode(e);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    
    // Change tooltip text
    e.firstChild.innerHTML = 'Copied';
}

// Hyperlink hover
function hlm(e){
    e.firstChild.innerHTML = 'Copy to clipboard';
}

// Is an element contained within two index boundaries?
function conT(e, ind, end){
    return ((ind > e.ind) && (end < e.end));
}

// Render the gallery
function showGallery(data){
    // Empty the contents
    $("#con").empty();
    
    // Create optional title
    if (gTitle != ""){
        $("#con").append('<h1 class="title">' + gTitle + '</h1>');
    }
    
    // Create navigation
    $("#con").append('<ul class="gridder" id="gallery"></ul>');
    
    // Add all elements
    var ss;
    for (var i=0; i<data.length; i++){
        ss = data[i].split(" | ");
        //console.log(ss);
        $("#gallery").append('<li class="gridder-list" data-griddercontent="#content' + i.toString() + '">' +
            '<div class="elem-responsive">' +
                '<div class="img-pad"></div>' +
                '<div class="img-container">' +
                    '<img src="' + ss[0] + '"/>' +
                '</div>' +
            '</div>' +
        '</li>');
        $("#con").append('<div id="content' + i.toString() + '" class="gridder-content">' +
            '<div class="elem-responsive elem-content" id="gallery-item-' + i.toString() + '">' +
                '<div class="img-pad"></div>' +
                '<div class="img-container img-full">' +
                    '<img src="' + ss[0] + '"/>' +
                '</div>' +
            '</div>' +
        '</div>');
        
        (function(){
            var lk = ss[1];
            $(document).on("click", "#gallery-item-" + i.toString(), function(){
                $.ajax({
                    dataType: 'jsonp',
                    data: JSON.stringify({'data': lk}),
                    url: 'gq?'
                });
            });
        })();
    }
    
    // Initialize gridder
    $('.gridder').gridderExpander({
        scroll: true,
        scrollOffset: 30,
        scrollTo: "panel",                  // panel or listitem
        animationSpeed: 400,
        animationEasing: "easeInOutExpo",
        showNav: true,                      // Show Navigation
        nextText: "<i class=\"fa fa-arrow-right\"></i>", // Next button text
        prevText: "<i class=\"fa fa-arrow-left\"></i>",  // Previous button text
        closeText: "<i class=\"fa fa-times\"></i>",      // Close button text
        onStart: function(){
            //Gridder Inititialized
        },
        onContent: function(){
            //Gridder Content Loaded
        },
        onClosed: function(){
            //Gridder Closed
        }
    });
}

// Request link (with retry)
function reqLink(linkName, i){
    $.ajax({
        url: 'https://api.codetabs.com/v1/proxy?quest=' + linkName,
        method: 'GET',
    }).done(function(res){
        // Store and render data
        rawList = res.match(/[^\r\n]+/g);
        showGallery(rawList);
    }).fail(function(res){
        // Handle failure to load resource
        if ((i+1) > MAX_RETRY){
            // Error
            console.error("Resource unavailable.");
        }
        else {
            // Retry
            setTimeout(function(){
                reqLink(linkName, i+1);
            }, RETRY_DELAY);
        }
    });
}

// On document load, add content
$(document).ready(function(){
    // Request URL
    console.log("Requesting...");
    $.ajax({
        dataType: 'jsonp',
        data: JSON.stringify({'rq_type': 1}),
        jsonp: 'callback',
        url: 'rq?callback=?',
        success: function(data) {
            //LOG
            console.log('success');
            console.log(JSON.stringify(data));
            
            // Set optional title
            if (data.hasOwnProperty('title')){
                gTitle = data['title'];
            }
            
            // Request link data (using CORS proxy)
            reqLink(data['link'], 0);
        }
    });
});