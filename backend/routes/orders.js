const {Order} = require('../models/order');
const {OrderItem} = require('../models/order-item');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) =>{

    const orderList = await Order.find().populate('user', 'name email').sort({'dateOrdered': -1});

    if(!orderList) {
        res.status(500).json({success: false});
    }
    res.send(orderList);
});

router.get(`/:id`, async (req, res) =>{

    //const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems');
    //const order = await Order.findById(req.params.id).populate('user', 'name email').populate({ path: 'orderItems', populate: 'product'});

    const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate({ path: 'orderItems', populate: {path: 'product', populate: 'category'}});

    if(!order) {
        res.status(500).json({success: false})
    }
    res.send(order);
});

router.get(`/get/totalsales`, async (req, res) =>{

    const totalSales = await Order.aggregate([
        { $group: {_id: null, total: {$sum: '$totalPrice'}}}
    ]);

    if(!totalSales) {
        res.status(400).json({error: 'The total sales cannot be calculated!'});
    }
    res.json({totalSales: totalSales.pop().total});
});

router.get('/get/count', async (req, res) => {

    const ordersCount = await Order.countDocuments();

    !ordersCount
        ? res.status(500).json({success: false})
        : res.json({ordersCount});
});

router.get(`/get/userorders`, async (req, res) => {

    try{

        const token = req.header('Authorization');

        if(!token)
            return res.status(401).json({ message: 'Access denied. No token provided.' });

        const decoded = jwt.verify(token.split(" ")[1], process.env.secret);

        const userOrderList = await Order.find({user: decoded.userId})
            .populate({ path: 'orderItems', populate: {path: 'product', populate: 'category'}})
            .sort({'dateOrdered': -1});

        if(!userOrderList) {
            res.status(500).json({success: false});
        }
        return res.json({userOrderList});

    }catch (err) {
        console.log(`Error in /get/userorders: ${err}`)
        return res.status(401).send({'Error': 'Server error!'});
    }
});

router.post('/', async (req, res) => {

    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }));

    const orderItemsIdsResolved =  await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map( async orderItemId => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }));

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrices.reduce((total, price) => total + price, 0),
        user: req.body.user,
    });

    order = await order.save();

    !order
        ? res.status(404).send('The order cannot be created!')
        : res.status(201).send(order);
});

router.put('/:id', async (req, res) => {
    try{
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            {new: true} // return updated data to UI
        );

        !order
            ? res.status(404).send('The order cannot be updated!')
            : res.status(200).send(order);

    }catch (err) {
        res.status(400).json({error: err })
    }
});

router.delete('/:id', async (req, res) => {

    Order.findByIdAndDelete(req.params.id).then(async order =>{
        if(order) {
            await Promise.all(
                order.orderItems.map(orderItem => OrderItem.findByIdAndDelete(orderItem))
            );
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err})
    });
});

module.exports = router;