class Room {
    constructor(name) {
        this.name = name;
        this.socketID1 = null;
        this.SocketID2 = null;
    }
    setUser1(User) {
        this.socketID1 = user;
    }
    setUser2(User) {
        this.SocketID2 = user;
    }
    getUsers() {
        return [this.socketID1, this.SocketID2];
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

    //TODO:Need to add name to username list
    socket.on("addUser", function(username, callbackFunctionClient){
        //console.log(username);
        //if name already exists
        for(i in socketName){
            if(socketName[i]==username){
                callbackFunctionClient(false);
                return;
            }
        }
        //else
        socketName[socket.id] = username;
        callbackFunctionClient(true);
    });
     //below will be used for socket stuff on server side
    var d = new Date();

    socket.on("sendMsg", function(msgFromClient){
        io.emit("sayChat", d.getHours() + ":" + d.getMinutes() + " " + socketName[socket.id] + ": " + msgFromClient);
    });

    socket.on("moveUser", function(roomName, callbackFunctionClient){
        if(Rooms[roomName].socketID1 != null && Rooms[roomName].SocketID2 != null){//room is full
            console.log("Tried to join full room.");
            callbackFunctionClient(false);
        }else if(Rooms[roomName].socketID1 != null){//room has one user already
            Rooms[roomName].SocketID2 = socket.id;
            callbackFunctionClient(true);
        }else if(Rooms[roomName].socketID1 == null && Rooms[roomName].SocketID2 != null){//joining room 2nd user
            Rooms[roomName].socketID1 = socket.id;
            callbackFunctionClient(true);
        }else{
            Rooms[roomName].socketID1 = socket.id;
            callbackFunctionClient(true);
        }
    });
   
});

server.listen(80, function() {
    console.log("Server waiting on port 80 . . .")
});