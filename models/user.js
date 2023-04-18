// const Joi = require('joi')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        unique: [true, 'A user with the email provided already exit'],
        trim: true,
        lowercase: true,
        required: true,
        minLength: 10,
        maxLength: 30
    },
    
    // phasionName: {
    //     type: String,
    //     unique: true,
    //     trim: true,
    //     lowercase: true,
    //     required: true
    // },
    
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
    },
    // date: {
    //     type: Date,
    //     default: Date.now
    // },
    // 
},
{ 
    timestamps: true
}
)

// function validateUser(user) {
//     const schema = {
//         name: Joi.string().min(5).max(15).required(),
//         email: Joi.string().trim().lowercase().min(10).max(30).required(),
//     };

//     return Joi.validate(user, schema);
// }


UserSchema.plugin(passportLocalMongoose)

// exports.validate = validateUser;
module.exports = mongoose.model('User', UserSchema);
