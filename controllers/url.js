const URL = require('../models/url');
//const {nanoid} = require('nanoid');
//const nanoid = import('nanoid'); 
const shortid = require('shortid'); 
async function handleGenerateNewShortURL(req,res){
	const body = req.body;
	const shortId = shortid();
	if(!body.url){
		return res.status(404).json({error: 'URL is required.'});
	}
	await URL.create({
		shortId: shortId,
		redirectURL: body.url,
		visitedHistory: []
	});
	
	return res.json({id: shortId});
}

//handleGetAnalytics

async function handleGetAnalytics(req,res){
	const shortId = req.params.shortId;
	
	const result = await URL.findOne({shortId});
	
	return res.json({totalClicks: result.visitedHistory.length, analytics: result.visitedHistory});
}

module.exports = {
	handleGenerateNewShortURL,
	handleGetAnalytics,
};