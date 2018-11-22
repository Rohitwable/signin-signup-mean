const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email)=>{
    if(!email)
    {
        return false;
    }else{
        if(email.length < 5 || email.length > 30){
            return false;
        }else{
            return true;
        }
    }
};

let validEmailChecker = (email)=>{
    if(!email){
        return false;
    }else{
        const regExp = new RegExp(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
        return regExp.test(email);
    }
};
let usernameLengthChecker = (username) =>{
    if(!username){
        return false;
    }else{
        if(username.length < 8 || username.length > 12){
            return false;
        }else{
            return true;
        }
    }
};
let passwordLengthChecker = (password) =>{
    if(!password){
        return false;
    }else{
        if(password.length < 6 || password.length > 12){
            return false;
        }else{
            return true;
        }
    }
};
let validUsername = (username)=>{
    if(!username){
        return false;
    }else{
        const regExp = new RegExp(/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
}
const emailValidators = [
    {
        validator: emailLengthChecker,
        message: 'Email must be 5 to 30 characters'
    },
    {
        validator: validEmailChecker,
        message: 'Enter valid email address'
    }
];
const usernameValidators = [
    {
        validator: usernameLengthChecker,
        message: 'Username must be 8 to 12 characters'
    },
    {
        validator: validUsername,
        message: 'Enter valid username '
    }
]
const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: 'Password must be 8 to 12 characters'
    }
];
const userSchema = new Schema({
 email: {type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
 username: {type: String, required: true, unique: true, lowercase: true, validate: usernameValidators},
 password: {
     type: String, required: true, validate: passwordValidators
 }
});


userSchema.pre('save', function(next){
    if(!this.isModified('password'))
    return next();

    bcrypt.hash(this.password, null , null, (err, hash)=>{
        if(err) return next(err);
        this.password = hash;
        next();
    });
});
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}; 
module.exports = mongoose.model('User', userSchema);