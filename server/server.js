const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
// const User = require('./models/user.model')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const port = process.env.PORT || 9000;

app.get('/api', (req, res) => {
  res.send({ message: 'this is a test message' });
});


app.post('/api/login', async (req, res) => {
	// const user = await User.findOne({
	// 	username: req.body.username,
	// })

	// if (!user) {
	// 	return { status: 'error', error: 'Invalid login' }
	// }

	// const isPasswordValid = await bcrypt.compare(
	// 	req.body.password,
	// 	user.password
	// )
  const { username, password } = req.body

  isPasswordValid = password === 'password' && username === 'admin'

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: username
			},
			'mvte_server_secret'
		)

		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
});

// unknown routes should be handled by react
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname,'..', 'client', 'build', 'index.html'));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));