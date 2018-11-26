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
   
});

server.listen(80, function() {
    console.log("Server waiting on port 80 . . .")
});