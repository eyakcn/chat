var express = require('express'), app = express();
var jade = require('jade');
var socketUsers = {};

app.set('views', __dirname + '/views');
app.set('view engine', 'thymeleaf');
app.set("view options", { layout: false });
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('home.jade');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
        console.log('New user connected');

        socket.on('setPseudo', function (data) {
            console.log('User [' + data + '] logged in.');
            // socket.set('pseudo', data);
            socketUsers[socket.id] = data;
        });

        socket.on('message', function (message) {
            var user = socketUsers[socket.id];
            var data = { 'message' : message, 'pseudo' : user };
            socket.broadcast.emit('message', data);
            console.log("User [" + user + "] send this : " + message);

            // socket.get('pseudo', function (error, name) {
            //     var data = { 'message' : message, pseudo : name };
            //     socket.broadcast.emit('message', data);
            //     console.log("user " + name + " send this : " + message);
            // });
        });
    });
});