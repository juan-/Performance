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
var howManyCalcs = 0;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Calculate the number of moves per dancer from voting results and brodcast them
function calc() {
  var counter = {}
  votes.forEach(function(word) {
     counter[word] = (counter[word] || 0) + 1;
  });
  // sort by frequency
  votes.sort(function(x, y) {
    return counter[y] - counter[x];
  });
  while (votes.length > 60) { // ditch the least popular ones
    votes.pop();
  }

  var copySorted = votes.slice();

  shuffle(votes);
  moves = votes.slice(0, numPerformers);

	// send new moves
	io.emit('moves', moves);

  howManyCalcs++;

  return copySorted;
}


/******** URL HANDLING *******/

app.get('/', function(req, res){
	// res.session.id = getRandomInt(100); // prevents double voting
  res.render('index', { title: 'DAN 321', moves: moves });
});

app.get('/calc', function(req, res){
	var sortedVotes = calc();
  res.send(sortedVotes);
});

app.get('/reset', function(req, res){
  votes = shuffle(Array.from(Array(60), (e,i)=>i+1));
  moves = votes.slice(0, numPerformers);
  howManyCalcs = 0;
  res.send('reset');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('vote', function(msg){
    for (var i = 0; i <= howManyCalcs; i++) { // votes count for more later in the game?
      votes.push(msg);
    }
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
