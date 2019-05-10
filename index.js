const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
var io = require('socket.io')(http);
const fs = require('fs');
const channels = require('./lib/channels');
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/pub', function(req, res) {
    channels.getChannels().then((channel_data) => {
        res.render('pub', {channel_data: channel_data});
    });
});

app.get('/sub', function(req, res) {
    channels.getChannels().then((channel_data) => {
        res.render('sub', {channel_data: channel_data});
    });
});

app.get('/channels', function(req, res) {
    channels.getChannels().then((channel_data) => {
        res.render('channels', {channel_data: channel_data});
    });
});

app.post('/channel-add', function(req, res) {
    channels.addChannel(req.body.channel).then((channel_data) => {
        res.redirect('channels');
    });
});

io.on('connection', function(socket){
  console.log('an user connected');
  socket.on('chat message', function(msg){
    // console.log('Message: ' + msg);
    // console.log(typeof msg);
    io.sockets.emit('chat message', msg);
    let message = JSON.parse(msg);
    channels.getChannel(Number(message.channel)).then((channel_name) => {
        let dt = (new Date()).toISOString();
        let log_msg = dt + ' : Channel: ' + channel_name + ',  Message:  ' + message.msg + '\n';
        console.log(log_msg);
        fs.appendFile('message.log', log_msg, function(err) {
            return true;
        });
    });

  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(9990, function(){
  console.log('listening on *:9990');
});
/*
const server = app.listen(9990, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

server.on('connection', function(socket) {
  socket.on('data', function(chunk) {
    console.log(chunk.toString());
  });
});
*/
