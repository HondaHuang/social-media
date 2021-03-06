require('dotenv').config();
const express = require('express');
const server = express();
const router = require('./routes');
const path = require('path');
// To handle HTTP POST request in Express.js version 4 and above,
// body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body.
const bodyParser = require('body-parser');

// https://stackoverflow.com/questions/24988045/need-for-http-createserverapp-in-node-js-express
const http = require('http')
const socketServer = http.Server(server);
const io = require('socket.io')(socketServer);

// https://medium.com/@chloechong.us/how-to-deploy-a-create-react-app-with-an-express-backend-to-heroku-32decfee6d18
// We add a heroku-postbuild script to package.jsonso it knows to run the built in build method create-react-app gives us after Heroku is done doing its own build
// Serve static files from the React frontend app
if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  server.use(express.static('client/build'))
}

require('./config/passport');

// support parsing of application/json type post data
server.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
server.use(bodyParser.urlencoded({ extended: true }));

server.use('/api', router);
// send other requests index.html file, which handles the dynamic routing via React Router.
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});


// socket events //
let users = {};
io.on('connection', (socket) => {
  console.log('a user connected');
  users[socket.id] = "";
  console.log(users);
  io.sockets.emit('users list', Object.values(users))
  // just like on the client side, we have a socket.on method that takes a callback function
  // once we get a 'send message' event from one of our clients, we will send it to the rest of the clients using emit
  socket.on('send message', (name, message) => {
    console.log('sending message: ' + message)
    io.sockets.emit('send message', name, message)
  })
  socket.on('join chat', (name) => {
    console.log(name + 'has joined the chat')
    users[socket.id] = name;
    io.sockets.emit('users list', Object.values(users))
    io.sockets.emit('join chat', name)
  })
  socket.on('disconnect', () => {
    // no longer need removeAllListeners
    console.log('a user disconnected')
    delete users[socket.id]
    console.log(users)
    io.sockets.emit('users list', Object.values(users))
  })
})

const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {console.log('Express Server started on ' + PORT)});
socketServer.listen(PORT, () => {console.log('Socket Server started on ' + PORT)});
