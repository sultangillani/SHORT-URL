const {getUser} = require('../service/auth');

async function restrictToLoggedinUserOnly(req,res,next){
	//const userUid = req.cookies?.uid;
	
	const userUid = req.headers['authorization'];
	
	if(!userUid){
		return res.redirect('/login');
	}

	const token = userUid.split('Bearer ')[1];
	const user = await getUser(token);
	//const user = await getUser(userUid);
	
	if(!user){
		return res.redirect('/login');
	}
	
	req.user = user;
	next();
}

async function checkAuth(req,res,next){
	/*const userUid = req.cookies?.uid;
	const user = await getUser(userUid);*/
	const userUid = req.headers['authorization'];
	const token = userUid.split('Bearer ')[1];
	const user = await getUser(token);

	req.user = user;
	next();
}

module.exports = {
	restrictToLoggedinUserOnly,
	checkAuth
};