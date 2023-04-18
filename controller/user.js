// const express = require('express')
// const User = require('../models/user');
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

// module.exports = router;