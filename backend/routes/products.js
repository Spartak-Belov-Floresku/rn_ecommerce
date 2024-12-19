const {Product} = require('../models/product');
const {Category} = require('../models/category');
const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILTER_TYPE_IMAGE = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const validImg = FILTER_TYPE_IMAGE[file.mimetype];
        const uloadError = validImg !== undefined ? null: new Error('Invalid image type!');
        cb(uloadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.replace(' ', '-');
        const extension = FILTER_TYPE_IMAGE[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOption = multer({storage: storage});

router.get('/', async (req, res) => {
    // localhost:8000/api/v1/products?categories=234567,332434
    let filter = {}
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')};
    }
    const productList = await Product.find(filter).populate('category');;
    !productList
        ? res.status(500).json({success: false})
        : res.send(productList);
});

router.get('/', async (req, res) => {
    // const productList = await Product.find().select('name image -_id');
    // const productList = await Product.find().select('name image');
    const productList = await Product.find().select('name image category').populate('category');
    !productList
        ? res.status(500).json({success: false})
        : res.send(productList);
});

router.get('/:id', async (req, res) => {
    try{
        const product = await Product.findById(req.params.id).populate('category');
        !product
            ? res.status(500).json({message: "Product doesn't exist!"})
            : res.send(product);
    } catch (err) {
        console.log(err)
        res.status(500).json({error: "Server error!"});
    }
});

// router.post('/', (req, res) => {
//     const product = new Product({
//         name: req.body.name,
//         description: req.body.description,
//         richDescription: req.body.richDescription,
//         image: req.body.image,
//         brand: req.body.brand,
//         price: req.body.price,
//         category: req.body.category,
//         countInStock: req.body.countInStock,
//         rating: req.body.rating,
//         numReviews: req.body.numReviews,
//         isFeatured: req.body.isFeatured,
//     });
//     product.save()
//     .then(createdProduct => res.status(201).json(createdProduct))
//     .catch(err=> res.status(500).json({error:err}));
// });

// new async code
router.post('/', uploadOption.single('image'), async (req, res) => {

    try{
        const category = await Category.findById(req.body.category);

        const file = req.file;
        if(!category || !file) res.status(400).json({error: 'Invalid category or image is not attached!'});

        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: basePath + fileName,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        });

        product = await product.save();
        res.status(201).json(product);

    }catch (err){
        console.log(err)
        res.status(500).json({error: "Server error!"});
    }
});

router.put('/:id', uploadOption.single('image'), async (req, res) => {

    // test if id's format valid
    if(!mongoose.isValidObjectId(req.params.id))
        return res.status(400).json({error: 'Invalid Product ID!'});

    try{

        const category = await Category.findById(req.body.category);
        if(!category) res.status(400).json({error: 'Invalid category!'});

        const product = await Product.findById(req.params.id);
        if(!product) res.status(400).json({error: 'Invalid product!'});

        const file  = req.file;
        let imagePath;
        if(file){
            const fileName = req.file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
            imagePath = basePath + fileName;
        }else{
            imagePath = product.image;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: imagePath,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
            },
            {new: true} // return updated data to UI
        );

        !updatedProduct
            ? res.status(400).send('The product cannot be updated!')
            : res.status(200).send(product);

    }catch (err) {
        console.log('Error ' + err);
        res.status(500).json({error: 'Server error!' })
    }
});

router.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id).then(result => {
        if(result)
            return res.status(200).json({success: true, message: 'The product has been deleted!'});
        res.status(404).json({success: false, message: 'The product not found!'});
    }).catch(
        err => res.status(400).json({success: false, error: 'Server error!' })
    );
});

router.get('/get/count', async (req, res) => {

    const productCount = await Product.countDocuments();

    !productCount
        ? res.status(500).json({success: false})
        : res.send({productCount});
});

router.get('/get/featured/:count', async (req, res) => {

    const count = req.params.count? req.params.count: 0;
    const products = await Product.find({isFeatured: true}).limit(+count);

    !products
        ? res.status(500).json({success: false})
        : res.send({products});
});

router.put(
    '/gallery-images/:id',
    uploadOption.array('images', 5),
    async (req, res) => {

    // test if id's format valid
    if(!mongoose.isValidObjectId(req.params.id))
        return res.status(400).json({error: 'Invalid Product ID!'});

    try{

        const product = await Product.findById(req.params.id);
        if(!product) res.status(400).json({error: 'Invalid product!'});

        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

        if(files){
            files.map(file => {
                imagesPaths.push(basePath + file.filename);
            });

            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    image: imagesPaths
                },
                {new: true} // return updated data to UI
            );

            return !updatedProduct
                ? res.status(400).send('The product cannot be updated!')
                : res.status(200).send(updatedProduct);
        }

        return res.status(400).send('The product cannot be updated!')

    }catch (err) {
        console.log('Error ' + err);
        res.status(500).json({error: 'Server error!' })
    }
});

module.exports = router;