const express = require('express');
const router = express.Router();
// const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user');
const Product = require('../models/product');
// const user = require('../models/user');


router.get('/', (req, res) => {
    res.render('home');
});

router.get('/register', (req, res) => {
    res.render('register')
})

// Making use of PASSPORT-LOCAL-MONGOOSE
router.post('/register', async (req, res, next) => {
    try {
        const { name, username, password, email } = req.body;
        const user = new User({name,  username, password, email });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', `${user.username} Welcome to Phasionistar`)
            res.redirect('/login');
        })

    } catch(error) {
        console.log('Registration failed', error);
        
        req.flash('error', `Registration failed !. ${error.message}`)
        // req.flash('error', `Registration failed !, A user with the email provided already exit`)
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


router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
        return next(err);
        }
        req.flash('success', 'session terminated');
        res.redirect('/');
    });
});


router.all('*', (req, res) => {
    res.send('<h1> Error Page </h1>')
    // res.render('home');
})



// router.post('/register', async (req, res) => {
//     try {
//         const { name, phasionName, password, email } = req.body;

//         const hashPassword = await bcrypt.hash(password, 12);

//         const user = new User({
//             name, 
//             phasionName, 
//             password: hashPassword, 
//             email
//         });
//         await user.save();
//         res.redirect('/login');
//     } catch(error) {
//         console.log('Registration failed')
//         res.status(400).send(error);
//     }
// })


// router.post('/login', async(req, res) => {
//     // const { email, password } = req.body;
//     const { phasionName, password } = req.body;
//     const user = await User.findOne({ phasionName })
//     if(!user) {
//         res.send('User not Found')
//     }
//     const isPasswordMatch = bcrypt.compare(password, user.password);
//     if(isPasswordMatch) {
//         res.send(`you are welcome ${phasionName}`)
//     } else {
//         res.send('Password mismatch');
//         console.log(password, user.password);
//     }

//     // if(password === req.body.password && email === req.body.email) {
//     //     console.log('you can log in now')
//     // }
//     // res.send('login in');
// })



// router.get('*', (req, res) => {
//     res.send('<h1> Bad Route </h1>')
//     // res.render('home');
// })



// router.get('/welcome', (req, res) => {
//     res.render('welcome');
// })





// app.get('/register/:id/:review', (req, res) => {
//     const { id, review } = req.params
//     res.send(`<h1> Reg Page for ${id} ${review} review</h1>`)
//     // res.render('home');
// })

// app.get('/street', (req, res) => {
//     const { q, date } = req.query;
//     res.send(`<h1> Reg Page for: ${q} ${date}</h1>`)
//     // res.render('home');
// })



    // router.get('/logout', (req, res) => {
    //     req.logout();
    //     req.flash('success', 'Goodbye');
    //     res.redirect('/home');
    // })

module.exports = router;