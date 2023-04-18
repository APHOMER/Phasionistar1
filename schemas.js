// const BaseJoi = require('joi');

// // OMO ! I NEED ANOTHER VALIDATOR.

// const extension = (joi) = ({
//     type: 'string',
//     base: joi.string(),
//     messages: {
//         'string.escapeHTML': '{{#label}} must not include HTML!'
//     },
//     rules: {
//         escapeHTML: {
//             validate(value, helpers) {
//                 const clean = sanitizeHtml(value, {
//                     allowedTags: [],
//                     allowedAttributes: {},
//                 });
//                 if(clean !== value) return helpers.error('string.escapeHTML', { value })
//             }
//         }
//     }
// });

// module.exports.productSchema = joi.object({
//     product: Joi.object({
//         ownerName:Joi.string().required().escapeHTML,
//         // owner: Joi.string().replace(),
//         contact: Joi.number().required(),
//         price: Joi.number().required().min(0),
//         deposit:  Joi.number().required().min(0),
//         deliveryDate:Joi.date().required().min(Date.now()).escapeHTML,
//     }).required(),
//     deleteClothImages: Joi.array()
// });


// const sanitizeHtml = require('sanitize-html');

// // const clean = sanitizeHtml(dirty, {
// //     allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
// //     allowedAttributes: {
// //       'a': [ 'href' ]
// //     },
// //     allowedIframeHostnames: ['www.youtube.com']
// //   });

//   const clean = sanitizeHtml(dirty, {
//     allowedTags: [],
//     allowedAttributes: {},
//     // allowedIframeHostnames: ['www.youtube.com']
//   });

// const Joi = BaseJoi.extend(extension);
// // escapeHTML