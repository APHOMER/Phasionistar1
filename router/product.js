const express = require('express');
const router = express.Router();
// const path = require('path');
// const User = require('../models/user');
// const Product = require('../models/product');
const products = require('../controller/products');
const { isLoggedIn, isAuthorize } = require('../middleware/middleware');
const multer = require('multer');
const { storage } = require('../cloudinary/cloud');
const upload = multer({ storage })
// const upload = multer({ dest: 'clothImages/' })



router.get('/clothing', products.getNewCloth)

router.get('/clothings', isLoggedIn, products.getAllClothes);
// how to measure
router.get('/howToMeasure', isLoggedIn, products.howToMeasure);


router.post('/clothing', isLoggedIn, upload.array('clothImage'), products.createNewCloth);

// router.post(upload.array('clothImage'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send('its working');
// })

router.get('/clothing/:id/edit', isLoggedIn, isAuthorize, products.renderEditCloth)
// // return cloth.countDocuments({ delivered: true })
router.put('/clothing/:id', isLoggedIn, isAuthorize, upload.array('clothImage'), products.updateCloth);

router.delete('/clothing/:id', isLoggedIn, isAuthorize, products.deleteCloth);

router.get('/clothing/:id', isLoggedIn, products.getClothById);



module.exports = router;
