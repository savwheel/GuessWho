var socket = io();
var secretName = null;
var myUsername = null;

//need to change formatting and test once query is working.
socket.on("updateClientLeaderBoard", function(scoreArray){
	$("leaderBoardScore").val("");
	var score;
	for(score in scoreArray){
		$("leaderBoardScore").append(score);
	}
});

socket.on("checkSelf", function(name, sockets){
	if(sockets.includes(socket.id)){
		console.log(name);
		console.log(secretName);
		if(name===secretName){
			console.log("inside of checkSelf, lose");
			socket.emit("lose");
		}else{
			console.log("fail");
		}
	}
});

socket.on("checkName", function() {
	if(myUsername != null) {
		$("#gameScreen").hide();
		$("#lobbyScreen").hide();
		$("#startScreen").show();
		$("#leaderBoardScore").empty();
		$("#board").empty();
		$("#chatWindow").empty();
		$("#playerImgDiv").empty();
		myUsername = null;
		secretName = null;
	}
});

socket.on("sayChat", function(chatData, sockets){
	if(sockets.includes(socket.id)){
		$("#chatWindow").append(chatData+"\n");
	}
});

socket.on("updateRooms", function(roomArray) {
	for (var i=0; i < 5; i++) {
		var ol = "room"+(i+1)+"List";
		$("#room"+(i+1)+"List").html("");
		var firstItem = document.createTextNode(roomArray[i][0]);
		var secondItem = document.createTextNode(roomArray[i][1])
		var elm1 = document.createElement("li");
		var elm2 = document.createElement("li");
		elm1.appendChild(firstItem);
		elm2.appendChild(secondItem);
		document.getElementById(ol).appendChild(elm1);
		document.getElementById(ol).appendChild(elm2)
	}
});

socket.on("winOrLose", function(sockets){
	if(sockets.includes(socket.id)) {
		$("#board").empty();
		$("#gameTitle").empty();
		var ourBoard = document.getElementById("board");
		if(sockets[0]==socket.id) {
			$(ourBoard).append('<h1>CONGRATULATIONS! YOU WON!</h1><br>');
		}
		if(sockets[1]==socket.id) {
			$(ourBoard).append('<h1>OH NO! YOUR OPPONENT HAS GUESSED YOUR PLAYER CORRECTLY. BETTER LUCK NEXT TIME!</h1><br>');
		}
		$(ourBoard).append('<button type="button" id="playAgainButton">Play Again</button>');
		$(ourBoard).append('<button type="button" id="returnToLobbyButton">Return To Lobby</button>');
	}
});

//This is the method that will populate the board when they first start the game
function populate() {
	$("#board").empty()
	var ourBoard = document.getElementById("board");
	var thePlayer = document.getElementById("yourPlayer");
	$(thePlayer).prepend('<div class="col mini-box" id="playerImgDiv"><img id="playerImg" src="img/charlie.jpg" alt="Photo of blank identity"></div>')
	$(thePlayer).prepend("<h2>Your Character</h2>");
	//client asks server for array of images to use in populate here
	for(var i = 0; i < 3; i++) {
		$(ourBoard).append('<div class="row" id ="row' + i + '">');
		for(var j = 0; j < 6; j++) {
			//go through the array given by the server to append images 
			$("#row"+ i).append('<img class="petImages" id="'+ "thename"+'"src="img/charlie.jpg" alt="Photo of blank identity">');
			if(j == 5)
				$(ourBoard).append('</div>');
		}
	}

	$(".petImages").click(function() {
		console.log("in pet images click");
		if($(this).css('opacity')==0.2){
			$(this).css('opacity','1.0');
		}
		else $(this).css('opacity','0.2');
	});

}

function startThings() {
	$("#gameScreen").hide();
	$("#lobbyScreen").hide();
	$("#startScreen").show();
	
	$("#submit").click(function() {
		if(typeof $("#username") !== null || $("#username").val() !== ""){
			socket.emit("addUser", $("#username").val(), function(loginSuccessful) {
				if(loginSuccessful === true) {
					$("#startScreen").hide();
					$("#lobbyScreen").show();
					myUsername = $("#username").val();
					secretName = "Charlie";	//random generate
					socket.emit("getLobbyNames");
				}
			});
		}
	});

	$("#guessButton").click(function(){
		if(typeof $("#guess")!== null){
			console.log("pushing guess");
			socket.emit("guessing", $("#guess").val());
		}
	});

	$("#playAgainButton").click(function(){
		console.log("play again button click");
		secretName = "Charlie";	//random generate
		populate();
		socket.emit("getLeaderboard");
	});

	$("#returnToLobbyButton").click(function(){
		console.log("return to lobby button click");
		socket.emit("removeSelfFromRoom");
		$("#startScreen").hide();
		$("#gameScreen").hide();
		$("#lobbyScreen").show();
		socket.emit("getLobbyNames");
	});

	//when they click a join button in the lobby they attempt to join a room
	$(".join").click(function() {
		var button = this;
		socket.emit("moveUserToRoom", button.id, function(moveSuccessful) {
			if(moveSuccessful === true) {
				$("#lobbyScreen").hide();
				$("#gameScreen").show();
				populate();
				socket.emit("getLobbyNames");
				socket.emit("getLeaderboard");//updating leaderboard for the first time here
			}
			else {
				//Tell them the room is full if they try to join a full room
				var parent = button.parentNode.id;
				var elm = document.createElement("h3");
				var node = document.createTextNode(" This room is full. Come back later. ");
				document.getElementById(parent).appendChild(elm.appendChild(node));
			}
		});
	});

	//when they send a message to the chat, call back, clear msg
	$("#chatButton").click(function(){
		socket.emit("sendMsg", $("#message").val());
		console.log($("#message").val());
		$("#message").val("");
	});	
}

$(startThings);