// const express = require('express')
const User = require('../models/user');
const bcrypt = require('bcryptjs');
// const router = express.Router();

// router.post('/user/login', async(req, res) => {

//     // const { error } = validate(req.body);
//     // if(error) return res.status(400).send(error.details[0].message);

    
//     const {name, email, password } = req.body
//     const user = User.findOne({ email: email });

//     if(user) return res.status(400).send('A User has already registered with this email');

//     user = new User({ name, email, password })
//     await user.save()

//     res.send(user);
// })


exports.getRegister = (req, res, next) => {
    res.render('register', { user });
};

exports.postRegister = async (req, res) => {
    try{
        const { username, email, password, confirmPassword } = req.body;

        const user = await User.findOne({ email: email})
        if(user) {
            req.flash('error', "user Already exist");
            res.redirect('/register');
        }

        if(password !== confirmPassword) res.status(400).send("password is not Matching")

        const hashPass = await bcrypt.hash(password, 12)
        user = new User({ username, email, hashPass })
        
        user.save();
        res.redirect('/login');
        
    } catch(err){
        console.log(err);
    }
}

exports.getLogin = (req, res, next) => {
    res.render('login.ejs');

}

exports.postLogin = (req, res) => {
    const { username, password } = req.body;
    const user = User.findOne({ username: username })
    if(!user) {
        console.log('user does not exist')
        res.status(400).send('user doe not exist');
        res.redirect('/');
    }
    isValidPass = bcrypt.compare(password, username.password);

    if(isValidPass) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save()
        res.redirect('/clothings');
    }

}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/')
    })
}
// module.exports = router;