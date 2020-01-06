var readline = require('readline');
var express = require('express');
var app = express();

// Local variables
var linkURL = '';
var gTitle = '';

app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   next();
});


app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
});

app.get('/instagallery.css', function (req, res) {
    res.sendFile( __dirname + "/" + "instagallery.css" );
});

app.get('/jquery-gridder.min.css', function(req,res){
    res.sendFile( __dirname + "/" + "jquery-gridder.min.css" );
});

app.get('/instagallery.js', function (req, res) {
    res.sendFile( __dirname + "/" + "instagallery.js" );
});

app.get('/*.js', function (req, res) {
    // Send data
    
});

app.get('/*.rq', function(req, res){
    // Send data
    //var id = req.url.split('.')[0];
    //id = id.replace(/\/+/g, '');
});

app.get('/rq', function(req, res){
    // Send data
    console.log("Got a request.");
    console.log(req.url);
    var obj = {"link": linkURL};
    if (gTitle != ''){
        obj['title'] = gTitle;
    }
    res.jsonp(obj);  // Send JSON wrapped with callback
});

app.get('/gq', function(req, res){
    // Show link
    console.log("Got a link: " + req.url);
    res.jsonp({});
});

// Listen on port
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
   
    console.log("InstaGallery server listening at http://localhost:%s", port);
    
    // Read input from user
    var rl = readline.createInterface({input: process.stdin, output: process.stdout});
    var rec = function(){
        rl.question('Input pastebin link> ', function (answer) {
            linkURL = answer;
            rl.question('Input optional title> ', function (answer) {
                gTitle = answer;
            });
        });
    };
    rec();
});