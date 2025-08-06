const express = require('express');

const {connectMongoDb} = require('./connect');

const urlRoute = require('./routes/url');
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const PORT = 8001;
const URL = require('./models/url');

const dbURI = 'mongodb://127.0.0.1:27017/short-url'; 

connectMongoDb(dbURI).then(() => console.log('MongoDB connected successfully!')).catch(err => console.error('MongoDB connection error:', err));

app.use( express.json() );

app.use('/url', urlRoute);

app.get('/:shortId', async (req, res) => {
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