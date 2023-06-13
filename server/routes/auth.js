const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const User = require('../models/user.model');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/login', async (req, res) => {
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

module.exports = router;