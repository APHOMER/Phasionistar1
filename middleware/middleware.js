const Product = require('../models/product');

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

    try {
        if(!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl;
            req.flash('error', 'you must be signed in');
            console.log(`You must be signed in`);
            return res.redirect('/login');
        } 
        
    } catch (error) {
        console.log(error);
    }
    next();
    
}


// module.exports.validateCloth = (req, res, next) = {
//     const { error } = productSchema.validate(req.body);
//     if(error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new MongoExpiredSessionError(msg, 400); 
//     } else {
//         next();
//     }
// }

module.exports.isAuthorize = async (req, res, next) => {
    try {
        const { id } = req.params;
        const cloth = Product.findById(id);
        // if(!cloth.owner.equals(req.user._id)) {
        if(!cloth.owner == req.user._id) {
            req.flash('error', 'you are not permitted to do this')
            return res.redirect(`/clothing/${id}`);
        } else {
            next();
        }
    } catch (error) {
        console.log(`error due to ${error}`)
        res.send(error);
    }
}
