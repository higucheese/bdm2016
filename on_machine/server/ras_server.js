/*
ras-server.js
    http server
    exec python commands
    set locale
    set direction
*/

/* http server */

var http = require("http");
var fs = require("fs");
var server = http.createServer();

server.on("request", function(req, res){
    console.log("Requested Url:" + req.url);
    fs.readFile("./content/index.html", "utf-8", function(err, data){
        if(err){
            res.writeHead(404, {"Content-Type" : "text/plain"});
            res.write("404 Not Found");
            return res.end();
        }
        res.writeHead(200, {"Content-Type" : "text/html"});
        res.write(data);
        res.end();
    });
});


var PORT = 80;

server.listen(PORT);
