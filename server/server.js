require('dotenv').config();
const path = require('path');

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

//create server and socket
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
  path: '/api/performance/stream',
});

//connect to db
const mongoose = require('mongoose');

//declare routes
const auth = require('./routes/auth');
const info = require('./routes/info');
const performance = require('./routes/performance');
const streamRoute = require('./routes/streams');

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

//link routes
app.use('/api', auth);
app.use('/api/info', info);
app.use('/api/performance', performance);
streamRoute(io);

const port = process.env.PORT || 9000;

app.get('/api', (req, res) => {
  res.send({ message: 'this is a test message'});
});

// unknown routes should be handled by react
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname,'..', 'client', 'build', 'index.html'));
});

httpServer.listen(port, () => {
  console.log(`listening on port ${port}`);
});
