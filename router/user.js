const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');
const passport = require('passport');


router.get('/', (req, res) => {
    res.render('home');
});

router.get('/register', (req, res) => {
    res.render('register')
})


// Making use of PASSPORT-LOCAL-MONGOOSE
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, username, password, } = req.body;
        const user = new User({ name, username, password, email });
        const registeredUser = await User.register(user, password);
        // console.log(registeredUser);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', `${user.username} Welcome to Phasionistar`)
            res.redirect('/clothings');
        })

    } catch(error) {
        console.log('Registration failed', error);
        req.flash('error', `Registration failed !. ${error.message}`)
        res.redirect('/register');
    }
})



//  Login Page
router.get('/login', (req, res) => {
    res.render('login');
});


// Making use of PASSPORT-LOCAL-MONGOOSE
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {  
    try {
        req.flash('success', `welcome back `);   
        const redirectUrl = req.session.returnTo || '/clothings'
        delete req.session.returnTo;
        res.redirect(redirectUrl);

    } catch(error) {
        console.log(error);
    }
    })



    router.get('/logout', (req, res) => {
        req.logout();
        req.flash('success', 'Goodbye');
        res.redirect('/');
    })





router.all('*', (req, res) => {
    res.send('<h1> Error Page </h1>')
    // res.render('home');
})





module.exports = router;