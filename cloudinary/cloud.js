const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_KEY, 
//     api_secret: process.env.CLOUDINARY_SECRET
//   });

https = require('https');

// options
var options = {
    host: 'eternagame.wikia.com',
    path: '/wiki/EteRNA_Dictionary'
}

// // get
// https.get(options, callback);

cloudinary.config({ 
    cloud_name: 'dfhhjkekb', 
    api_key: '986687577347183', 
    api_secret: 'HlTJiIl_7Yoi1UiJSgrHKLAPXts' 
  });


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Phasionistar',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})

module.exports = { cloudinary, storage }
