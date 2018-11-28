class Room {
    constructor(name) {
        this.name = name;
        this.user1 = null;
        this.user2 = null;
        this.join = true;
    } 
    status() {
        return this.join;
    }
    setUser1(User) {
        this.user1 = user;
    }
    setUser2(User) {
        this.user2 = user;
    }
    getUsers() {
        return [this.user1, this.user2];
    }
}

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

var Rooms = [new Room("Room1"), new Room("Room2"), new Room("Room3"), new Room("Room4"), new Room("Room5")];

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