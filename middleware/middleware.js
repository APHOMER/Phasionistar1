const Product = require('../models/product');
const User = require('../models/user');

// module.exports.isLoggedIn = (req, res, next) => {
//     if(!req.isAuthenticated()) {
//         req.session.returnTo = req.originalUrl;
//         req.flash('error', 'you must be signed in');
//         console.log(`You must be signed in`);
//         return res.redirect('/login');
//     } 
//     next();
// }



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        console.log('You must be signed in first!')
        return res.redirect('/login');
    }
    next();
}


module.exports.isAuthorize = async (req, res, next) => {
    try {
        const { id } = req.params;
        const cloth = await Product.findById(id);
        // const cloth = await Product.findById(req.user._id);
        // const cloth = await Product.find({ id : req.user._id }).populate('owner');
        // if(!cloth.owner.equals(req.user._id)) {
        if(!cloth.owner == req.user._id) {
            req.flash('error', 'you are not permitted to do this')
            return res.redirect(`/clothing/${id}`);

            
        }
        next();
    } catch (error) {
        console.log(`error due to ${error}`)
        res.send(error);
    }
}
