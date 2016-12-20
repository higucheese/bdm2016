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
    fs.readFile("/home/pi/bdm2016/on_machine/server/content/index.html", "utf-8", function(err, data){
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
  socket.on("reboot", function(){
    exec("reboot", function(){});
  });
  socket.on("led", function(){
    exec("python /home/pi/bdm2016/on_machine/led_test.py", function(){});
  });
  socket.on("webcam", function(){
    exec("python /home/pi/bdm2016/on_machine/capture_test.py", function(){});
  });
  socket.on("theta", function(val){
    var command = "python /home/pi/bdm2016/on_machine/servo_theta.py " + val.value;
    exec(command, function(){});
  });
  socket.on("phi", function(val){
    var command = "python /home/pi/bdm2016/on_machine/servo_phi.py " + val.value;
    exec(command, function(){});
  });
  socket.on("depth", function(){
    exec("python /home/pi/bdm2016/on_machine/depth_test.py", function(err, stdout, stderr){
      io.sockets.emit("depth_stdout", {value:stdout});
    });
  });
  socket.on("omni_depth", function(){
    exec("python /home/pi/bdm2016/on_machine/search.py", function(){});
  });
  socket.on("omni_scene", function(){
    exec("python /home/pi/bdm2016/on_machine/capture_sphere.py", function(){});
  });
});
