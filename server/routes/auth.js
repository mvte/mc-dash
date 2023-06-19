const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
  const roles = ['admin', 'user']

  isPasswordValid = password === 'password' && username === 'admin'

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: username,
				roles: roles
			},
			process.env.JWT_SECRET,
			{ expiresIn: '24h' }
		)

		return res.json({ ok: true, token: token })
	} else {
		return res.json({ ok: false, token: false })
	}
});

module.exports = router;