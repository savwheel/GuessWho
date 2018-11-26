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

var sanitize = require("sanitize-html");

app.use(express.static("./pub"));

var socketName = [];
//TODO::Finish socketNames, Finish Chat

//function to show the leaderboard scores on the client side
function showLeaderBoard(error, result){
    db.collection("scores").find({}).toArray(function(err,docs){
        if(err!=null){
            console.log("Error... " + err);
        }
        else{
            io.emit("updateScores", docs);
        }
    });
}


io.on("connection", function(socket) {
    console.log("A user connected");
     //below will be used for socket stuff on server side

    //refresh will be called in start it all to give an initial leaderboard
    socket.on("refresh", function(){
        db.collection("scores").find({}).toArray(function(err,docs){
            if(err!=null){
                console.log("Error... " + err);
            }
            else{
                io.emit("updateScores", docs);
            }
        });
    });

    socket.on("sendChat", function(msgFromClient){
        var d = new Date();

        io.emit("sayChat", d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " " + socketName[socket.id] + " >  " + sanitize(msgFromClient));
    });
   
});

server.listen(80, function() {
    console.log("Server waiting on port 80 . . .")
});