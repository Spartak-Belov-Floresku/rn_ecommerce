const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin routers ---------------------------------------------------------------------
router.get(`/`, async (req, res) =>{
    // const userList = await User.find().select('name phone email');
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
});

router.get(`/:id`, async (req, res) => {
    console.log('Test')
    try{
        const user = await User.findById(req.params.id).select('-passwordHash');
        !user
            ? res.status(500).json({message: "The user with the given ID is not found!"})
            : res.status(200).send(user);
    }catch (err) {
        res.status(400).json({error: err })
    }
});

router.post('/', async (req,res)=>{

    try{
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        });

        user = await user.save();

        !user
            ? res.status(401).send('The user cannot be created!')
            : res.status(201).send(user);

    }catch (err) {

        res.status(401).send({'Error': err});

    }
})

router.put('/:id',async (req, res)=> {
    try{
        const userExist = await User.findById(req.params.id);
        let newPassword
        if(req.body.password) {
            newPassword = bcrypt.hashSync(req.body.password, 10)
        } else {
            newPassword = userExist.passwordHash;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                passwordHash: newPassword,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country,
            },
            { new: true}
        )

        !user
            ? res.status(401).send('The user cannot be created!')
            : res.status(201).send(user);

    }catch (err) {

        res.status(401).send({'Error': err});

    }
});

router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err})
    })
});

router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments();

    if(!userCount) {
        res.status(500).json({success: false})
    }
    res.send({
        userCount: userCount
    });
});


//Users routers ----------------------------------------------------------

router.post('/register', async (req, res) => {
    try{
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        });

        user = await user.save();

        !user
            ? res.status(401).send('The user cannot be created!')
            : res.status(201).send(user);

    }catch (err) {

        console.log(`Error ${err}!`);
        res.status(500).send('The user cannot be created!');

    }
});

router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email});

        if(!user || !bcrypt.compareSync(req.body.password, user.passwordHash)){
            return res.status(400).send('The user not found!');
        }else{
            const secret = process.env.secret;
            const token = jwt.sign(
                {
                    userId: user.id,
                    isAdmin: user.isAdmin
                },
                secret,
                {expiresIn: '1d'} // Token expiration time set to 1 day

            )
            return res.status(200).send({userEmail: user.email, token});
        }

    }catch (err) {
        console.log(`Error ${err}!`)
        res.status(500).send('Server error!')
    }
});

module.exports = router;