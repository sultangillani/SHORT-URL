const mongoose = require('mongoose');

//Schema::
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    user_email: {
        type: String,
        required: true,
        unique: true
    },
    user_password: {
        type: String,
        required: true,
    }
    
},{timestamps: true});

const User = mongoose.model('user',userSchema);

module.exports = User;