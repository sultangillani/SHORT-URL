const {getUser} = require('../service/auth');

function restrictTo(roles=[]){
	return function(req,res,next){
		if(!req.user){
			return res.redirect('/login');
		}

		if(!roles.includes(req.user.role) ){
			return res.end('Unauthorized');
		}

		return next();
	}
}

function checkForAuthentication(req,res,next){
	const tokenCookie = req.cookies?.token;
	//const authorizationHeaderValue = req.headers['authorization'];
	req.user = null;

	if(!tokenCookie){
		return next();
	}

	const token = tokenCookie.split('Bearer '); // For Headers Only
	
	let final_token = '';
	if(token.length > 1){
		final_token = token[1];
	}else{
		
		final_token = token[0];
	}

	const user = getUser(final_token);
	req.user = user;
	return next();
}

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
	checkAuth,
	checkForAuthentication,
	restrictTo
};