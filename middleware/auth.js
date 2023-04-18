const jwt = require('jsonwebtoken');

const Joi = require('joi');
const bcrypt = require('bcryptjs');
const User = require('../models/user')

const express = require('express');
const router = express.Router();



router.post('/auth', async(req, res) => {
    const {email, password } = req.body;

    const error = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: email })
    if(!user) return res.status(400).send('Invalid Email or password.')

    const isValidPassword = bcrypt.compare(password, user.password);

    if(!isValidPassword) res.status(400).send('Invalid Email or password.')

    const token = jwt.sign({ _id: user._id}, 'jwtPhasionistar');
    res.send(token);
});


function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(30).required(),
        password: Joi.string().min(5).max(30).required()
    }

    return Joi.validate(req, schema);
};





