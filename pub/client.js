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
//sidjfpidsjf
//This is the method that will populate the board when they first start the game
//It just uses a blank photo right now but we can change it to pull from the database
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
			// $(table.rows[i].cells[j]).append("<img src='img/blankPerson.jpg' alt='Photo of blank identity'>");
		}

	}



	$("#thename").click(function() {
		if($(this).css('opacity')==0.2){
			$(this).css('opacity','1.0');
		}
		else $(this).css('opacity','0.2');
	});
}

//If the window is smaller than a certain size then the board moves down and the chat and leader board resize
//this should get called in update users when we create it.
function changeSizeDispaly() {
	var windowSize = window.innerWidth;
	var screenSize = screen.width;
	if (windowSize <= (screenSize*.8)) {
		$("#leaderBoard").css("width", "45%");
		
	}
}

function startThings() {
	$("#gameScreen").hide();
	$("#startScreen").show();

	var table = document.getElementById("board");

	changeSizeDispaly();


	$("#submit").click(function() {
		socket.emit("addUser", $("#username").val(), function(loginSuccessful) {
			if(loginSuccessful === true) {
				$("#startScreen").hide();
				$("#gameScreen").show();
				populate();
			}
		});
	});




	//when they send a message to the chat, call back, clear msg
	$("#chatButton").click(function(){
		socket.emit("sendMsg", $("#message").val());
		console.log($("#message").val());
		$("#message").val("");
	});
	
	//changeSizeDispaly();
	//if(loggedIn){
	//	$("#startScreen").show();
	//	$("#gameScreen").show();
	//	//This part doesn't work yet
	//	for(var i = 0; i < 4; i++) {
	//		for(var j = 0; j < 6; j++) {
	//			table.rows[i].cells[j].onclick = function() {
	//				$(table.rows[i].cells[j]).css("opacity", ".7");		//When they click a photo it resets the opacity so they can see its been eliminated
	//			}
	//		}
	//	}
	//}
	//socket.emit("refresh");
}

$(startThings);