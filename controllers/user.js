const User = require('../models/user');
const {v4: uuidv4} = require('uuid');
const {setUser} = require('../service/auth');

async function handleUserSignup(req, res){
    const {name, email, password} = req.body;
    await User.create({
        username: name,
        user_email: email,
        user_password: password
    });

    return res.redirect('/');
}

//handleUserLogin
async function handleUserLogin(req, res){
    const {email, password} = req.body;
    const user = await User.findOne({
        user_email: email,
        user_password: password
    });

    if(!user){
        //return res.redirect('/login');
        return res.render('login',{
            error: "Invalid User & Password",
        });
    }

    const sessionId = uuidv4();
    setUser(sessionId, user);

    res.cookie('uid', sessionId);

    return res.redirect('/');
}

module.exports = {
	handleUserSignup,
    handleUserLogin
};