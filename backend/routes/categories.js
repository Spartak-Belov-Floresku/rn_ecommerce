const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();

    !categoryList
        ? res.status(500).json({success: false})
        : res.status(200).send(categoryList);
});

router.get(`/:id`, async (req, res) => {
    try{
        const category = await Category.findById(req.params.id);
        !category
            ? res.status(500).json({message: "The category with the given ID is not found!"})
            : res.status(200).send(category);
    }catch (err) {
        res.status(400).json({error: err })
    }
});

router.put('/:id', async (req, res) => {
    try{
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                icon: req.body.icon || category.icon,
                color: req.body.color
            },
            {new: true} // return updated data to UI
        );

        !category
        ? res.status(404).send('The category cannot be updated!')
        : res.status(200).send(category);

    }catch (err) {
        res.status(400).json({error: err })
    }
});

router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });

    category = await category.save();

    !category
        ? res.status(404).send('The category cannot be created!')
        : res.status(201).send(category);
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndDelete(req.params.id).then(result => {
        if(result)
            return res.status(200).json({success: true, message: 'The category has been deleted!'});
        res.status(404).json({success: false, message: 'The category not found!'});
    }).catch(
        err => res.status(400).json({success: false, error: err })
    );
});

module.exports = router;