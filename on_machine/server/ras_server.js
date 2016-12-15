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
        res.writeHead(200, {"Content-Type" : "text/html"});
        res.write(data);
        res.end();
    });
});

var io = require("socket.io").listen(server);
var PORT = 80;
server.listen(PORT);

var execSync = require("child_process").execSync;

io.sockets.on("connection", function(socket){
  socket.on("led", function(){
    execSync("python ../led_test.py", function(){});
    alert("led test");
  });
  socket.on("webcam", fucntion(socket){
    execSync("python ../capture_test.py", function'({}));
  });
});
