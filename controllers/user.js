const User = require('../models/user');

async function handleUserSignup(req, res){
    const {name, email, password} = req.body;
    await User.create({
        username: name,
        user_email: email,
        user_password: password
    });

    return res.render('home');
}

module.exports = {
	handleUserSignup
};