var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

console.log(mov);

app.get('/', function(req, res){
	res.send('dance. dance Jonathan.')
  //res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    