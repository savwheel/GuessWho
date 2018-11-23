var express = require("express");
var server = express();
server.use(express.static("./pub"));
var bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({extended: true}));

server.listen(80, function() {
    console.log("Server waiting on port 80 . . .")
});