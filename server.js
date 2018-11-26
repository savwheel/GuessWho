var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var client = new MongoClient("mongodb://localhost:27017", {useNewUrlParser: true});
var db;

var express = require("express");

var server = express();

var http = require("http");

var server = http.Server(app);
var socketio = require("socket.io");
var io = socketio(server);

server.use(express.static("./pub"));
var bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({extended: true}));


io.on("connection", function(socket) {
    console.log("A user connected");

    //below will be used for socket stuff on server side
});

server.listen(80, function() {
    console.log("Server waiting on port 80 . . .")
});