const express = require ('express');
const Order = require ('../models/order')
const Router = require('express');
const {separateIntoArray} = require('../../middleware/edit');
const {joinItems} = require('../../middleware/joinItems');

const router = express.Router();

router.get('/all', async function(req, res, next){
    
    try {
        const order = await Order.getAll();
        return res.json({order})
    }catch(err){
        return next(err)
    }
});

router.get('/:orderId', async function(req, res, next){
    try{
        const order = await Order.get(req.params.orderId);
            return res.json({order})
    }catch(err){
        return next(err)
    }
});

router.post('/new', async function(req, res, next){
    try{
        const order = await Order.createOrder ({...req.body, active_status: true});
        return res.status(201).json(order)
    }catch(err){
        return next(err)
    }
});

router.delete('/:orderId', async function (req, res, next){
    try{
        await Order.remove(req.params.orderId);
        return res.json({deleted: req.params.orderId})
    }catch (err){
        return next(err)
    }
});
router.get('/:orderId/editOrder', async function (req, res, next){
    try {
        const order = await Order.getItemizedOrder(req.params.orderId);
        const orderString = Object.values(order).toString();
        const itemArr = separateIntoArray(orderString)
        return res.json({itemArr});
    }catch(err){
        return next(err)
    }
});

router.patch("/:orderId/newItems", async function (req, res, next){
    try {
        const dbReady = joinItems(Object.values (req.body))
        const order = await Order.editFoodItems(req.params.orderId, dbReady);
        return res.json({order});
    }catch(err){
        return next(err)
    }
})

router.post('/:orderId/completed', async function(req, res, next){
    try{
        let order = await Order.archivedOrder(req.params.orderId, req.body)
        return res.json({order})
    }catch(err){
        return next(err)
    }
});

module.exports = router;