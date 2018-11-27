var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var client = new MongoClient("mongodb://localhost:27017", {useNewUrlParser: true});
var db;

var express = require("express");

var app = express();

var http = require("http");

var server = http.Server(app);
var socketio = require("socket.io");
var io = socketio(server);

app.use(express.static("./pub"));

var socketName = [];
//TODO::Finish socketNames, Finish Chat

//function to show the leaderboard scores on the client side



io.on("connection", function(socket) {
    console.log("A user connected");
     //below will be used for socket stuff on server side

    socket.on("sendMsg", function(msgFromClient){
        io.emit("sayChat", msgFromClient);
    });
   
});

server.listen(80, function() {
    console.log("Server waiting on port 80 . . .")
});