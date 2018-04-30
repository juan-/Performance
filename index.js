var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 8080;

var section = [1, 16, 31, 46];

var d = 6;
var votes = [];
var prob = [];

// sim response 
votes[1] = 2;
votes[2] = 3;
votes[3] = 2;
votes[4] = 3;
numVotes = votes.reduce((a, b) => a + b, 0);
console.log(numVotes)

prob[1] = Math.floor(votes[1]/numVotes*d);
prob[2] = Math.floor(votes[2]/numVotes*d);
prob[3] = Math.floor(votes[3]/numVotes*d);
prob[4] = Math.floor(votes[4]/numVotes*d);


console.log(prob)
/*var mov = {0:[],1:[],2:[],3:[]};
mov[0].name = 'Granham';
mov[1].name = 'Dunham';
mov[2].name = 'Limon';
mov[3].name = 'Duncan';*/


//for (i = 1; i <= 60; 1+15*i) {
//    for (j = 0; j < 15; j++) {
//        mov[Math.floor(i / 15)].numers.push(i + j);
//    }
//}


app.get('/', function(req, res){
	res.send('dance. dance Jonathan.')
  //res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

app.listen(port, function(){
  console.log('listening on *:8080');
});
    