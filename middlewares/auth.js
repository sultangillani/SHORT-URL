const {getUser} = require('../service/auth');

async function restrictToLoggedinUserOnly(req,res,next){
	const userUid = req.cookies?.uid;
	
	if(!userUid){
		return res.redirect('/login');
	}

	const user = await getUser(userUid);
	
	if(!user){
		console.log(user);
		return res.redirect('/login');
	}
	
	req.user = user;
	//console.log(req.user);
	next();
}

module.exports = {
	restrictToLoggedinUserOnly
};