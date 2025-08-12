const mongoose = require('mongoose');

//Schema::
const urlSchema = new mongoose.Schema({
	shortId: {
		type: String,
		required: true,
		unique: true
	},
	redirectURL: {
		type: String,
		required: true,
	},visitedHistory: [
		{ timestamp: { type: Number } }
	],
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}
	
},{timestamps: true});

const URL = mongoose.model('url',urlSchema);

module.exports = URL;