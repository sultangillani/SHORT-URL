const express = require('express');
const router = express.Router();
const URL = require('../models/url');
const {getUser} = require('../service/auth');

router.get('/', async (req, res) => {
	//const user = req.user;

	const userUid = req.cookies?.uid;
	const user = await getUser(userUid);
	console.log(user);

	if(!user){
		return res.redirect('/login');
	}

	const allUrls = await URL.find({ createdBy: user._id });
	return res.render('home',{
		urls: allUrls,
	});
});

router.get('/signup', (req, res) => {
	return res.render('signup');
});

router.get('/login', (req, res) => {
	return res.render('login');
});

module.exports = router;