class Room {
    constructor(name) {
        this.name = name;
        this.socketID1 = null;
        this.socketID2 = null;
    }
    getUsers() {
        var users = [this.socketID1, this.socketID2];
        return users;
    }
}

//TODO::Win/lose is currently hardcoded to charlie on both players
//need to change this through using MONGO
//leaderboard

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
//TODO::Finish socketNames, DISABLE GUESS BOX WHEN GAME FINISHED!!!!, append to leaderboard
var secretNameList = ["Charlie", "Sasha"];

var Rooms = [new Room("Room1"), new Room("Room2"), new Room("Room3"), new Room("Room4"), new Room("Room5")];

//function to show the leaderboard scores on the client side


io.on("connection", function(socket) {
    console.log("A user connected");

    socket.emit("checkName");
    socket.emit("updateScores");

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
        //if already in database as a user, do nothing
        db.collection("scores").find({name:username}).toArray(function(err, docs){
            if(err!=null){
                console.log("Error: " + err);
            }else{
                if(docs[0]==undefined){
                    db.collection("scores").insertOne({name:username, score:0});
                }
            }
        });
        //if not, insert username and set score to 0
        callbackFunctionClient(true);
    });

    socket.on("guessing", function(guess){
        var room = findMyRoom(socket.id);
        io.emit("checkSelf", guess, room.getUsers());
    });

    //getLeaderboard will query the DB, and return an array of the scores
    socket.on("getLeaderboard", function(){
        db.collection("scores").find({},{projection:{'_id':0}}).sort({score:-1}).toArray(function(err, docs){

            if(err!=null){
                console.log("Error: " + err);
            }else{
                socket.emit("updateClientLeaderBoard",docs);
            }
        });
    });

    //TODO:ERROR CHECKING
    //
    socket.on("lose", function(){
        //leaderboard infromation on socket.id lose
        //findmyroom on socket
        var userRoom = findMyRoom(socket.id);
        //find loser in DB with socket
        db.collection("scores").find({name:socketName[socket.id]}).toArray(function(err, doc){
            if(err!=null){
                console.log("ERROR ON DB FIND..." + err);
            }else{
                var i; 
                for(i in doc){
                    if(doc[0].score>0){
                        db.collection("scores").updateOne({name:socketName[socket.id]},{$set:{score:doc[0].score-5}});
                    }
                }
            }
        });
        //if the first socket is the loser
        if(userRoom.socketID1==socket.id){
            //update winner
            var secondUser = userRoom.socketID2;
            db.collection("scores").find({name:socketName[secondUser]}).toArray(function(err, doc){
                if(err!=null){
                    console.log("ERROR ON DB FIND..." + err);
                }else{
                    var i; 
                    for(i in doc){
                            db.collection("scores").updateOne({name:socketName[secondUser]},{$set:{score:doc[0].score+5}});
                    }
                }
            });
        }if(userRoom.socketID2==socket.id){
            //update winner
            var secondUser = userRoom.socketID1;
            db.collection("scores").find({name:socketName[secondUser]}).toArray(function(err, doc){
                if(err!=null){
                    console.log("ERROR ON DB FIND..." + err);
                }else{
                    var i; 
                    for(i in doc){
                            db.collection("scores").updateOne({name:socketName[secondUser]},{$set:{score:doc[0].score+5}});
                    }
                }
            });
        }
        
        //used to change the behavior of the game screen on win/lose
        changeGameScreen(socket.id);
        console.log("PLAYER: " + socketName[socket.id] + " lost." )
    });


     
    var d = new Date();
    socket.on("sendMsg", function(msgFromClient){
        var userRoom = findMyRoom(socket.id);
        io.emit("sayChat", d.getHours() + ":" + d.getMinutes() + " " + socketName[socket.id] + ": " + msgFromClient, userRoom.getUsers());
    });

    socket.on("getLobbyNames", function(){
        var roomArray = [];
        for (var i=0; i<5; i++){
            var room = Rooms[i];
            var tempArray = ["Available", "Available"];
            if (room.socketID1 != null) {
                tempArray[0] = socketName[room.socketID1];
            }
            if (room.socketID2 != null) {
                tempArray[1] = socketName[room.socketID2];
            }
            roomArray[i] = tempArray;
        }
        io.emit("updateRooms", roomArray)
    });

    socket.on("removeSelfFromRoom", function() {
        var userRoom = findMyRoom(socket.id);
        if (userRoom != null) {
            if (userRoom.socketID1 === socket.id) {
                userRoom.socketID1 = null;
            }
            if (userRoom.socketID2 === socket.id) {
                userRoom.socketID2 = null;
            }
            io.emit("sayChat", socketName[socket.id] + " has left.", userRoom.getUsers());
        } 
    });

    socket.on("moveUserToRoom", function(roomName, callbackFunctionClient){
        if(Rooms[roomName].socketID1 != null && Rooms[roomName].socketID2 != null){//room is full
            console.log("Tried to join full room.");
            callbackFunctionClient(false);
        }else if(Rooms[roomName].socketID1 != null){//room has one user already
            Rooms[roomName].socketID2 = socket.id;
            var userRoom = findMyRoom(socket.id);
            io.emit("sayChat", socketName[socket.id] + " has joined.", userRoom.getUsers());
    
            callbackFunctionClient(true);
        }else if(Rooms[roomName].socketID1 == null && Rooms[roomName].socketID2 != null){//joining room 2nd user
            Rooms[roomName].socketID1 = socket.id;
            var userRoom = findMyRoom(socket.id);
            io.emit("sayChat", socketName[socket.id] + " has joined.", userRoom.getUsers());
            callbackFunctionClient(true);
        }else{
            Rooms[roomName].socketID1 = socket.id;
            var userRoom = findMyRoom(socket.id);
            io.emit("sayChat", socketName[socket.id] + " has joined.", userRoom.getUsers());
            callbackFunctionClient(true);
        }
    });


    socket.on("disconnect", function() {
        console.log("A user diconnected")
        var userRoom = findMyRoom(socket.id);
        if (userRoom != null) {
            if (userRoom.socketID1 === socket.id) {
                userRoom.socketID1 = null;
            }
            if (userRoom.socketID2 === socket.id) {
                userRoom.socketID2 = null;
            }
            io.emit("sayChat", socketName[socket.id] + " has left.", userRoom.getUsers());
        }  
        socketName[socket.id] = null;
    });
});

function findMyRoom(socketID) {
    for(var i=0; i < 5; i++) {
        if (Rooms[i].socketID1 === socketID || Rooms[i].socketID2 === socketID) {
            return Rooms[i]
        }
    }
    return null;
}

function changeGameScreen(socketID) {
    console.log("inside of changeGameScreen")
    var room = findMyRoom(socketID);
    var users = room.getUsers();
    var sockets = [];
    if(socketID == users[0]){
        sockets[0] = users[1];
        sockets[1] = users[0];
    }
    else{
        sockets = users;
    }
    io.emit("winOrLose", sockets);
}


client.connect(function(err) {
	if (err != null) throw err;
	else {
		db = client.db("scores");
		server.listen(80, function() {
			console.log("Server with socket.io is ready.");
		});
	}
});