var socket = io();
var secretName = null;

socket.on("updateScores", function(scoreArray){
	$("#leaderBoard").html("");
	var score;
	for(score of scoreArray){
		$("#leaderBoard").append(score);
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

socket.on("sayChat", function(chatData, sockets){
	if(sockets.includes(socket.id)){
		$("#chatWindow").append(chatData+"\n");
	}
});

socket.on("updateRooms", function(roomArray) {
	console.log("updateRooms")
	for (var i=0; i < 5; i++) {
		var ol = "room"+(i+1)+"List";
		console.log(ol);
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

//This is the method that will populate the board when they first start the game
function populate() {
	var ourBoard = document.getElementById("board");

	var thePlayer = document.getElementById("yourPlayer");
	$(thePlayer).prepend('<div class="col mini-box"><img id="playerImg" src="img/charlie.jpg" alt="Photo of blank identity"></div>')
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
}

function startThings() {
	$("#gameScreen").hide();
	$("#lobbyScreen").hide();
	$("#startScreen").show();

	var table = document.getElementById("board");
	

	$("#submit").click(function() {
		if(typeof $("#username") !== null){
			socket.emit("addUser", $("#username").val(), function(loginSuccessful) {
				if(loginSuccessful === true) {
					$("#startScreen").hide();
					$("#lobbyScreen").show();
					console.log("calling: getLobbyNames");
					secretName="Charlie";
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

	

	//when they click a join button in the lobby they attempt to join a room
	$(".join").click(function() {
		var button = this;
		socket.emit("moveUserToRoom", button.id, function(moveSuccessful) {
			if(moveSuccessful === true) {
				$("#lobbyScreen").hide();
				$("#gameScreen").show();
				populate();
			}
			else {
				//Tell them the room is full if they try to join a full room
				var parent = button.parentNode.id;
				var node = document.createTextNode("This room is full. Come back later");
				var elm = document.createElement("h3");
				document.getElementById(parent).appendChild(elm.appendChild(node));
			}
		});
	});

	$(".petImages").click(function() {
		console.log("in pet images click");
		if($(this).css('opacity')==0.2){
			$(this).css('opacity','1.0');
		}
		else $(this).css('opacity','0.2');
	});

	//when they send a message to the chat, call back, clear msg
	$("#chatButton").click(function(){
		socket.emit("sendMsg", $("#message").val());
		console.log($("#message").val());
		$("#message").val("");
	});

	
	
	
}

$(startThings);