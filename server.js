// Import dependencies
let express = require('express');
let app = express();

// process.env.PORT is related to deploying on heroku
let server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server has started")
});

// Shows only files in the "public" folder to users
app.use(express.static('public'));

// WebSocket Portion
// WebSockets work with the HTTP server
let io = require('socket.io')(server);

let players = [];

// This is run for each individual user that connects
io.sockets.on('connection', (socket) =>
    {
        players.push(socket.id);
        console.log(`New Client ${socket.id}`);

        if (players.length === 2)
        {
            console.log("Two players connected")
            io.sockets.emit('player_turn', {'player_id': players[0]});
            io.sockets.emit('game_start', {'game_start': true});
            io.to(players[0]).emit('type', {'circle': true, 'line': false});
            io.to(players[1]).emit('type', {'circle': false, 'line': true});
        }
        else if (players.length > 2)
        {
            console.log("To many players! Alert!");
        }

        // When this user emits, client side: socket.emit('event', some data);
        // socket.on('mouse', (data) =>
        // {
        //     // Send it to all other clients
        //     socket.broadcast.emit('mouse', data);

        //     // This is a way to send to everyone including sender
        //     // io.sockets.emit('message', "this goes to everyone");
        // });

        socket.on('shape_draw', (data) =>
        {
            let next_player;
            if (players.indexOf(socket.id) + 1 < players.length) {
                next_player = players[players.indexOf(socket.id) + 1];
            } else {
                next_player = players[0];
            }
            io.sockets.emit('shape_draw', data);
            io.sockets.emit('player_turn', {'player_id': next_player});
        });

        socket.on('disconnect', () =>
        {
            console.log(`Client ${socket.id} has disconnected`);
            players = players.filter(item => item !== socket.id)
        });
    }
);

