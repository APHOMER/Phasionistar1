const Product = require('../models/product');
const { cloudinary } = require('../cloudinary/cloud');

module.exports.getNewCloth = (req, res) => {
    res.render('cloth/new');
}

module.exports.getAllClothes = async (req, res) => {
    // let pageNumber = 1; // PAGINATION
    // let pageSize = 2;
    
    try {
        const clothes = await Product.find({ })
        // const clothes = await Product.find({ id: req.user._id })
        // const clothes = await Product.find({ }).populate('user')
        
        // clothes //for PAGINATION
            .sort('deliveryDate')
            // .select('ownerName')
            // .skip((pageNumber - 1) * pageSize)
            // .limit(pageSize);

            
        if(!clothes) {
            req.flash('error', 'No Clothes available');
            res.send("No Clothes available");
        }
        
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
        const cloth = new Product({ ownerName, contact, price, deposit, deliveryDate, measurements, clothImages, leg, neck, waist, shoulder, arm,  chest, bicep, wrist, back, stomach, hip, thigh });
        cloth.clothImages = req.files.map(f => ({ url: f.path, filename: f.filename }))
        cloth.owner = req.user._id;
        await cloth.save();
        req.flash('success', 'successfully made a new cloth');
        res.redirect('/clothings');
    } catch (error) {
        console.log('clothing error' + error)
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
        if(req.body.deleteClothImages) {
            for(let filename of req.body.deleteClothImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await cloth.updateOne({ $pull: { clothImages: { filename: { $in: req.body.deleteClothImages } } } })
        }
        // console.log(`Weldone ${cloth.ownerName}'s measurements  has been Updated`)
        req.flash('success', `Weldone ${cloth.ownerName}'s measurements has been Updated`)
        res.redirect(`/clothing/${cloth._id}`)
    } catch(error) {     
        console.log(error);
        req.flash('error', ` ${error}`);
        // res.send(`Error:${error}`)
        res.redirect(`/clothings`);
    }
}

module.exports.deleteCloth = async (req, res) => {
    try{
        const { id } = req.params;
        const cloth = await Product.findByIdAndDelete(id);
        req.flash('success', `Hurray ${cloth.ownerName}'s Measurement has been deleted`)
        res.redirect('/clothings');

    } catch(error) {
        console.log('Deleting Error ' + error);
        res.send(`Deleting Error: ${error}`)
    }
}

module.exports.getClothById = async (req, res) => {
    try {
        const { id } = req.params;
        const cloth = await Product.findById(id).populate('owner');
        if(!cloth) {
            req.flash('error', 'This cloth is not available')
            return res.redirect('/clothings')
        }
        // console.log(cloth);
        res.render('cloth/show', { cloth })
    } catch(error) {
        console.log(error);
        res.send(`Error: ${error}`)
    }
}



