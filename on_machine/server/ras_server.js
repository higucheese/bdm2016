/*
ras-server.js
    http server
    exec python commands
    set locale
    set direction
*/

/* http server */
var fs = require("fs");
var http = require("http");
var server = http.createServer();

server.on("request", function(req, res){
    console.log("Requested Url:" + req.url);
    fs.readFile("./content/index.html", "utf-8", function(err, data){
        if(err){
            res.writeHead(404, {"Content-Type" : "text/plain"});
            res.write("404 Not Found");
            return res.end();
        }
        stream.pipe(res);
        res.writeHead(200, {"Content-Type" : "text/html"});
        res.write(data);
        res.end();
    });
});

var io = require("socket.io").listen(server);
var PORT = 80;
server.listen(PORT);

var exec = require("child_process").exec;

io.socket.on("connection", function(socket){
  socket.on("led", function(){
    exec("python ../", function(){});
  });
});
