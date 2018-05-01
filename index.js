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

var numPerformers = 4;
var votes = shuffle(Array.from(Array(60), (e,i)=>i+1));
var moves = votes.slice(0, numPerformers);
var usersDidVote = {};

// var fTimer;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function start() {
	// fTimer = setTimeout(calc, 60000);
  calc();
}

// Calculate the number of moves per dancer from voting results and brodcast them
function calc() {
  shuffle(votes);
  moves = votes.slice(0, numPerformers);

  // counts for debugging
  var counts = {};
  for (var i = 0; i < votes.length; i++) {
    var num = votes[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  console.log(counts);

	// send new moves
	io.emit('moves', moves);

  usersDidVote = [];
}


/******** URL HANDLING *******/

app.get('/', function(req, res){
	// res.session.id = getRandomInt(100); // prevents double voting
  res.render('index', { title: 'DAN 321', moves: moves });
});

app.get('/begin', function(req, res){
	start();
  res.send('started');
});

app.get('/stop', function(req, res){
	// clearTimeout(fTimer);
  res.send('stopped');
});


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('vote', function(msg){
    console.log(msg);
    if (usersDidVote[msg.user_id]) {
      return;
    }
		votes.push(msg.number);
    usersDidVote[msg.user_id] = true;
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
