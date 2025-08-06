const fs = require('fs');

function logReqRes(fileName){
	return (req, res, next) => {
		console.log('Middleware 1');
		req.myNewUser = 'Happy Coding';
		
		fs.appendFile(fileName,`${Date.now()}: ${req.ip}: ${req.method}: ${req.path} \n`, (err,data) => {
			next();
		});
	}
}

module.exports = {
	logReqRes,
};