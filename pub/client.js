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
<<<<<<< HEAD

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
		
=======
>>>>>>> 25b93f4bebbc1f4c8aa7348e2da1037a8c996671
	}
}

function startThings() {
	$("#gameScreen").hide();
	$("#startScreen").show();

	var table = document.getElementById("board");
<<<<<<< HEAD

	changeSizeDispaly();

=======
>>>>>>> 25b93f4bebbc1f4c8aa7348e2da1037a8c996671

	$("#submit").click(function() {
		if(typeof $("#username") !== null){
			socket.emit("addUser", $("#username").val(), function(loginSuccessful) {
				if(loginSuccessful === true) {
					$("#startScreen").hide();
					$("#gameScreen").show();
					populate();
				}
			});
		}
	});

<<<<<<< HEAD


=======
	$("#thename").click(function() {
		if($(this).css('opacity')==0.2){
			$(this).css('opacity','1.0');
		}
		else $(this).css('opacity','0.2');
	});
>>>>>>> 25b93f4bebbc1f4c8aa7348e2da1037a8c996671

	//when they send a message to the chat, call back, clear msg
	$("#chatButton").click(function(){
		socket.emit("sendMsg", $("#message").val());
		console.log($("#message").val());
		$("#message").val("");
	});
	
	
}

$(startThings);