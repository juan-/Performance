var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 8080;

var section = [1, 16, 31, 46];

var d = 4;
var prob = [];
var votes = [];
var moves = [];
var voters = [];

var fTimer;

// sim response 
votes[0] = 1;
votes[1] = 8;
votes[2] = 2;
votes[3] = 8;
numVotes = votes.reduce((a, b) => a + b, 0);
// console.log(numVotes)

// Debug
// prob[1] = Math.floor(votes[0]/numVotes*d);
// prob[2] = Math.floor(votes[1]/numVotes*d);
// prob[3] = Math.floor(votes[2]/numVotes*d);
// prob[4] = Math.floor(votes[3]/numVotes*d);
//console.log(prob)

function start() {
	fTimer = setTimeout(roundStart, 60000);
}

function roundStart() {
	prob = [];
	moves = [];
	votes = [];
	voters = [];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function calc() {
	var numVotes = votes.reduce((a, b) => a + b, 0);
	console.log(numVotes)
	for (i=0; i < 4; i++) {
		prob[i] = Math.round(votes[i]/(numVotes)*d);
		for(j=0;j < prob[i];j++) {
			moves.push(getRandomInt(15) + section[i]);
		}
	}
	console.log(prob);
	console.log(moves);
}
calc();


/******** URL HANDLING *******/

app.get('/', function(req, res){
	res.session.id = getRandomInt(100); // prevents double voting
	res.send('dance. dance Jonathan.');
  //res.sendFile(__dirname + '/index.html');
});

app.get('/begin', function(req, res){
	voters = [];
	votes = [];
	prob = [];

});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('vote', function(move, id){
  	if (!voters[id]) {
  		votes[move] = votes[move] + 1;
  		voters[id] = 1;
  	}
  });
});

app.listen(port, function(){
  console.log('listening on *:8080');
});
    