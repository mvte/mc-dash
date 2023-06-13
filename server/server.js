const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const auth = require('./routes/auth');
const info = require('./routes/info');

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// link routes
app.use('/api', auth);
app.use('/api/info', info);

const port = process.env.PORT || 9000;

app.get('/api', (req, res) => {
  res.send({ message: 'this is a test message' });
});

// unknown routes should be handled by react
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname,'..', 'client', 'build', 'index.html'));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));