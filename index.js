const express = require('express');
const cookieParser = require('cookie-parser');

const {connectMongoDb} = require('./connect');
const {restrictToLoggedinUserOnly} = require('./middlewares/auth');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

const app = express();

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const PORT = 8001;
const URL = require('./models/url');

const dbURI = 'mongodb://127.0.0.1:27017/short-url'; 

connectMongoDb(dbURI).then(() => console.log('MongoDB connected successfully!')).catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use( express.json() );
app.use( express.urlencoded({extended: false}) );
app.use(cookieParser());

app.use('/url', restrictToLoggedinUserOnly, urlRoute);
app.use('/user', userRoute);
app.use('/', staticRoute);

app.get('/url/:shortId', async (req, res) => {
	const shortId = req.params.shortId;
	const entry = await URL.findOneAndUpdate({ shortId }, {
		$push: {
			visitedHistory: {timestamp: Date.now() }
		}
	});
	
	res.redirect(entry.redirectURL);
});

app.listen(PORT,() => {
	console.log('Server Started');
});