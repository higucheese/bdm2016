/*
ras-server.js
    http server
    exec python commands
    set locale
    set direction
*/

/* http server */
var http = require("http");
var server = http.createServer();

server.on("request", function(req, res){
    console.log("Requested Url:" + req.url);
    
    if (req.url == "/"){
        var fs = require("fs");
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
    } else {
        var fs = require("fs");
        fs.readFile("/home/pi/bdm2016/on_machine/frame.png", function(err, data){
            if(err){
                console.log("cannot read frame.png");
            }
            res.writeHead(200, {"Content-Type" : "image/png"});
            res.end(data, "binary");
        });
    }
});

var io = require("socket.io").listen(server);
var PORT = 80;
server.listen(PORT);

var exec = require("child_process").exec;

io.sockets.on("connection", function(socket){
  socket.on("led", function(){
    exec("python ../led_test.py", function(){});
  });
  socket.on("webcam", function(){
    exec("python ../capture_test.py", function(){});
  });
});
