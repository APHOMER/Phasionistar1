const Product = require('../models/product');
const { cloudinary } = require('../cloudinary/cloud');

module.exports.getNewCloth = (req, res) => {
    res.render('cloth/new');
}

module.exports.getAllClothes = async (req, res) => {
    // let pageNumber = 2; // PAGINATION
    // let pageSize = 10;
    try {
        const clothes = await Product.find({})

        // clothes //for PAGINATION
            // .sort('deliveryDate')
            // .select('ownerName')
            // .skip((pageNumber - 1) * pageSize)
            // .limit(pageSize);

            

        for(let cloth of clothes) {
            console.log(cloth.ownerName.toUpperCase());
            
            // cloth.clothImages.forEach(image => {
            //     console.log(image.url);
            // });

            
// cloth.clothImages.forEach(image => {
    
//     <div class="allCloth-name">
//         <a class="allCloth-name" href="/clothing/<%=cloth._id%>"><%=cloth.ownerName.toUpperCase()%></a>
//     </div>
//     <img crossorigin="anonymous" class="show" alt="...." src="<%=image.url%>">
// });

        }
        // console.log(clothes); 
        res.render('cloth/allclothes', { clothes });
        
    } catch (error) {
        console.log(error);
        res.send(`Error:${error}`)
    }
}


module.exports.howToMeasure = (req, res) => {
    res.render('cloth/howToMeasure');
}

module.exports.createNewCloth = async (req, res) => {
    try {
        const { ownerName, contact, price, deposit, deliveryDate, measurements, clothImages, leg, neck, waist, shoulder, arm,  chest, bicep, wrist, back, stomach, hip, thigh } = req.body
        
        // const cloth = new Product({ ...req.body })
        
        const cloth = new Product({ ownerName, contact, price, deposit, deliveryDate, measurements, clothImages, leg, neck, waist, shoulder, arm,  chest, bicep, wrist, back, stomach, hip, thigh });
        cloth.clothImages = req.files.map(f => ({ url: f.path, filename: f.filename }))
        cloth.owner = req.user._id;
        await cloth.save();
        console.log(cloth);
        req.flash('success', 'successfully made a new cloth');
        res.redirect('/clothings');
        // res.send(`${cloth.ownerName} has deposited ${ cloth.deposit} and it must be delivered on ${ cloth.deliveryDate }`);
       
    } catch (error) {
        console.log('clothing error' + error)
        // req.flash('error', `${error}`);  
        res.send(`Error:${error}`)
    }
}

module.exports.renderEditCloth = async (req, res) => {
    try {
        const { id } = req.params;
        const cloth = await Product.findById(id);
        if(!cloth){
            req.flash('error', 'cannot find measurement associated with this name');
            return res.redirect('/clothings');
        }
        res.render('cloth/edit', { cloth })
    } catch(error) {
        
        // req.flash('error', `${error}`)
        console.log(error);  
        res.send(`Error:${error}`)
        req.flash('error', `cannot get error: ${error}`)
    }
}

module.exports.updateCloth = async (req, res) => {
    try {
        const { id } = req.params;
        const cloth = await Product.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true });
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
        cloth.clothImages.push(...imgs);
        cloth.save();
        // await cloth.save();
        if(req.body.deleteClothImages) {
            for(let filename of req.body.deleteClothImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await cloth.updateOne({ $pull: { clothImages: { filename: { $in: req.body.deleteClothImages } } } })
        }
        console.log(`Weldone ${cloth.ownerName}'s measurements  has been Updated`)
        req.flash('success', `Weldone ${cloth.ownerName}'s measurements has been Updated`)
        res.redirect(`/clothing/${cloth._id}`)
    } catch(error) {
        // console.log(error);        
        res.send(`Error:${error}`)
        // req.flash('error', `error due to ${error}`);
    }
}

module.exports.deleteCloth = async (req, res) => {
    try{
        const { id } = req.params;
        const cloth = await Product.findByIdAndDelete(id);
        console.log(`Hurray ${cloth.ownerName}'s Measurement has been deleted`)
        res.redirect('/clothings');

    } catch(error) {
        console.log('Deleting Error ' + error);
        res.send(`Deleting Error: ${error}`)
    }
}


module.exports.getClothById = async (req, res) => {
    try {
        const { id } = req.params;
        const cloth = await Product.findById(id, { ...req.body }).populate('owner');
        // const cloth = await Product.findById(id, { ...req.body });
        console.log(cloth);
        if(!cloth) {
            req.flash('error', 'This cloth is not available')
            return res.redirect('/clothings')
        }
        console.log(cloth);
        res.render('cloth/show', { cloth })
    } catch(error) {
        console.log(error);
        res.send(`Error: ${error}`)
    }
}



