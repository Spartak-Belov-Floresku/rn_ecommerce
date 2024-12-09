const {Product} = require('../models/product');
const {Category} = require('../models/category');
const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');

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
router.post('/', async (req, res) => {

    try{
        const category = await Category.findById(req.body.category);
        if(!category)
            res.status(500).json({error: 'Invalid category!'});
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
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

router.put('/:id', async (req, res) => {

    // test if id's format valid
    if(!mongoose.isValidObjectId(req.params.id))
        return res.status(400).json({error: 'Invalid Product ID!'});

    try{
        const category = await Category.findById(req.body.category);
        if(!category)
            res.status(400).json({error: 'Invalid category!'});
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
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

        !product
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

module.exports = router;