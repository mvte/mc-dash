const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const mongoose = require('mongoose');
const userSchema = require('../model/User');
const User = mongoose.model('User', userSchema);
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});


router.post('/register', async (req, res) => {
	console.log(`[${new Date().toISOString()}]`, '[INFO] received request for /register');
	const { username, password: plainTextPassword } = req.body

	if (!username || typeof username !== 'string' || !isAlphaNumeric(username)) {
		return res.json({ ok: false, error: 'username must be alphanumeric' })
	}

	bcrypt.hash(plainTextPassword, saltRounds, async (err, hash) => {
		const user = new User({
			username: username,
			password: hash,
			admin: false,
		});
		try {
			await user.save()
			console.log(`[${new Date().toISOString()}]`, '[SUCCESS] user created successfully');
		} catch (error) {
			console.error(`[${new Date().toISOString()}]`, '[ERROR] failed to create user', error);
			if (error.code === 11000) {
				// duplicate key
				return res.json({ ok: false, error: 'username already exists' })
			}
			throw error
		}

		const token = jwt.sign(
			{
				name: username,
				roles: ['user']
			},
			process.env.JWT_SECRET,
			{ expiresIn: '24h' }
		);
		console.log(`[${new Date().toISOString()}]`, '[SUCCESS] token generated');
		res.json({ ok: true, token: token })
	});
});

router.post('/login', async (req, res) => {
	console.log(`[${new Date().toISOString()}]`, '[INFO] received request for /login');
	const { username, password } = req.body
	User.findOne({ username: username })
	.then(user => {
		if(!user) {
			return res.json({ ok: false, error: 'username or password is incorrect' });
		}
		const roles = user.admin ? ['admin', 'user'] : ['user'];

		bcrypt.compare(password, user.password, (err, result) => {
			if(err) {
				console.error(`[${new Date().toISOString()}]`, "[ERROR] failed to compare hashed password", err);
				return res.json({ ok: false, error: 'something went wrong please try again' });
			}

			if(result) {
				const token = jwt.sign(
					{
						name: username,
						roles: roles,
					},
					process.env.JWT_SECRET,
					{ expiresIn: '24h' }
				);
				console.log(`[${new Date().toISOString()}]`, '[SUCCESS] user logged in and token generated');
				return res.json({ ok: true, token: token });
			} else {
				console.log(`[${new Date().toISOString()}]`, '[INFO] user entered credentials incorrectly');
				return res.json({ ok: false, error: 'username or password is incorrect' });
			}
		});
	})
	.catch(err => {
		console.error(`[${new Date().toISOString()}]`, "[ERROR] could not find user", err);
		return res.json({ ok: false, error: 'something went wrong please try again' });
	});
});

function isAlphaNumeric(str) {
	let code, i, len;

	for (i = 0, len = str.length; i < len; i++) {
		code = str.charCodeAt(i);

		if (!(code > 47 && code < 58) && // numeric (0-9)
			!(code > 64 && code < 91) && // upper alpha (A-Z)
			!(code > 96 && code < 123)) { // lower alpha (a-z)
			return false;
		}
	}

	return true;
}


module.exports = router;