var socket = io();
var loggedIn = false;

socket.on("updateScores", function(scoreArray){
	$("#leaderBoard").html("");

	var score;
	for(score of scoreArray){
		$("#leaderBoard").append(score);
	}
});

//This is the method that will populate the board when they first start the game
//It just uses a blank photo right now but we can change it to pull from the database
function populate() {
	var table = document.getElementById("board");
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 6; j++) {
			$(table.rows[i].cells[j]).append("<img src='img/blankPerson.jpg' alt='Photo of blank identity'>");
		}
	}
}

//If the window is smaller than a certain size then the board moves down and the chat and leader board resize
//this should get called in update users when we create it.
function changeSizeDispaly() {
	var windowSize = window.innerWidth;
	var screenSize = screen.width;
	if (windowSize <= (screenSize*.8)) {
		$("#leaderBoard").css("width", "45%");
		$("#chatDialog").css("width", "45%");
	}
}

function startThings() {
	if(!loggedIn) { $("#startScreen").show(); }
	var table = document.getElementById("board");
	if (!$("#board td").html()) {
		populate();
	}
	$("#submitName").click(function() {
		socket.emit("addUser", $("#username"));
		loggedIn = true;
	});

	//when they send a message to the chat, call back, clear msg
	$("#chatButton").click(function(){
		socket.emit("sendMsg", $("#message").val());
		$("message").val("");
	});
	
	changeSizeDispaly();
	if(loggedIn){
		$("#startScreen").show();
		$("#gameScreen").show();
		//This part doesn't work yet
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 6; j++) {
				table.rows[i].cells[j].onclick = function() {
					$(table.rows[i].cells[j]).css("opacity", ".7");		//When they click a photo it resets the opacity so they can see its been eliminated
				}
			}
		}
	}
	socket.emit("refresh");
}

$(startThings);