// Exports
module.exports = {
    hlc: hlc,
    hlm: hlm
};

// Includes
$ = require("jquery");

// Globals
var jn = 0;      // Current request number

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

function logResults(json){
    console.log("Response:");
    console.log(json);
}

// On document load, add content
$(document).ready(function(){
    // Request URL
    console.log("Requesting...");
    $.ajax({
        dataType: 'jsonp',
        data: JSON.stringify({'blah': 123}),                      
        jsonp: 'callback',
        url: 'rq?callback=?',                   
        success: function(data) {
             //LOG
             console.log('success');
             console.log(JSON.stringify(data));               
        }
    });
});