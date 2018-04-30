var expressHbs = require('express-handlebars');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static('public'));

var port = process.env.PORT || 8080;

var section = [1, 16, 31, 46];

var d = 4;
var prob = [];
var votes = [];
var moves = [];
var voters = [];

var fTimer;

// simulation response
// votes[0] = 4;
// votes[1] = 5;
// votes[2] = 1;
// votes[3] = 2;
// numVotes = votes.reduce((a, b) => a + b, 0);
// calc();


// Debug
// prob[1] = Math.floor(votes[0]/numVotes*d);
// prob[2] = Math.floor(votes[1]/numVotes*d);
// prob[3] = Math.floor(votes[2]/numVotes*d);
// prob[4] = Math.floor(votes[3]/numVotes*d);
//console.log(prob)

function start() {
	fTimer = setTimeout(calc, 60000);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function gaussianRand() {
  var rand = 0;

  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  return rand / 6;
}

function gaussianRandom(start, end) {
  return Math.floor(start + gaussianRand() * (end - start + 1));
}

// Calculate the number of moves per dancer from voting results and brodcast them
function calc() {
	var numVotes = votes.reduce((a, b) => a + b, 0);
	console.log(numVotes)
	for (i=0; i < 4; i++) {
		prob[i] = Math.round(votes[i]/(numVotes)*d);
		for(j=0;j < prob[i];j++) {
			moves.push(gaussianRandom(0, 15) + section[i]);
		}
	}
	console.log(prob);
	console.log(moves);

	// send new moves
	io.emit('moves', moves);
	// reset params
	votes = [];
	voters = [];
}


/******** URL HANDLING *******/

app.get('/', function(req, res){
	// res.session.id = getRandomInt(100); // prevents double voting
  res.render('index', { title: 'DAN 321' });
});

app.get('/begin', function(req, res){
	start();
});

app.get('/stop', function(req, res){
	clearTimeout(fTimer);
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
