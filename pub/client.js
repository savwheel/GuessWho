var socket = io();

socket.on("updateScores", function(scoreArray){
	$("#leaderBoard").html("");
	var score;
	for(score of scoreArray){
		$("#leaderBoard").append(score);
	}
});

socket.on("sayChat", function(chatData){
	$("#chatWindow").append(chatData+"\n");
});

//This is the method that will populate the board when they first start the game
function populate() {
	var table = document.getElementById("board");

	var thePlayer = document.getElementById("yourPlayer");
	$(thePlayer).prepend('<div class="col mini-box"><img id="playerImg" src="img/charlie.jpg" alt="Photo of blank identity"></div>')
	$(thePlayer).prepend("<h2>Your Character</h2>");

	for(var i = 0; i < 3; i++) {
		$(table).append('<div class="row" id ="row' + i + '">');
		for(var j = 0; j < 6; j++) {
			$("#row"+ i).append('<img class="petImages" id="'+ "thename"+'"src="img/charlie.jpg" alt="Photo of blank identity">');
			if(j == 5)
				$(table).append('</div>');
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
				}
			});
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

	$("#thename").click(function() {
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