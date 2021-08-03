// Import dependencies
let express = require('express');
let app = express();

// process.env.PORT is related to deploying on heroku
let server = app.listen(process.env.PORT || 3000, listen);

// Some leads here. If you try to do this in sketch.js, it says it's not loaded and gives a weird error.
// We need to somehow transport this variable to the client using socket.io.
analyzerObject = require('drawn-shape-recognizer');

// Method tells us when server has started
function listen()
{
  console.log('Server has started');
}

// Shows only files in the "public" folder to users
app.use(express.static('public'));

// WebSocket Portion
// WebSockets work with the HTTP server
let io = require('socket.io')(server);

// This is run for each individual user that connects
io.sockets.on('connection', (socket) =>
    {
        console.log("New Client " + socket.id);

        // When this user emits, client side: socket.emit('event',some data);
        socket.on('mouse', (data) =>
        {
            // Send it to all other clients
            socket.broadcast.emit('mouse', data);

            // This is a way to send to everyone including sender
            // io.sockets.emit('message', "this goes to everyone");
        });

        socket.on('disconnect', () =>
        {
          console.log("Client " + socket.id + " has disconnected");
        });
    }
);