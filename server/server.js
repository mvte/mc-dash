require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

//create server and socket
const app = express();
const httpServer = createServer(app);
const perfIo = new Server(httpServer, {
  cors: {
    origin: '*',
  },
  path: '/api/performance/stream',
});
const consoleIo = new Server(httpServer, {
  cors: {
    origin: '*',
  },
  path: '/api/console/stream',
});

//connect to db
const mongoose = require('mongoose');

//create certificates
if(process.env.ENV == 'prod') {
  console.log("creating certs");
  const ca = Buffer.from(process.env.DOCKER_CA).toString();
  const cert = Buffer.from(process.env.DOCKER_CERT).toString();
  const key = Buffer.from(process.env.DOCKER_KEY).toString();
  
  const dir = __dirname + '/../certs';
  console.log("creating certs in " + dir);
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(path.resolve(__dirname, '..', 'certs', 'ca.pem'), ca);
  fs.writeFileSync(path.resolve(__dirname, '..', 'certs', 'cert.pem'), cert);
  fs.writeFileSync(path.resolve(__dirname, '..', 'certs', 'key.pem'), key);
}


//declare routes
const auth = require('./routes/auth');
const info = require('./routes/info');
const performance = require('./routes/performance');
const container = require('./routes/container');
const dataGrab = require('./routes/datagrab');
const perfStream = require('./streams/performance');
const consoleStream = require('./streams/console');

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

//link routes
app.use('/api', auth);
app.use('/api/info', info);
app.use('/api/performance', performance);
app.use('/api/container', container);
app.use('/api/datagrab', dataGrab);
perfStream(perfIo);
consoleStream(consoleIo);

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
