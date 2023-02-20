const express = require ('express');
const Customer = require ('../models/customer')
const Router = require('express');

const router = express.Router();

router.get('/all', async function(req, res, next){
    
    try {
        const customer = await Customer.getAll();
        return res.json({customer})
    }catch(err){
        return next(err)
    }
});

router.get('/:customerId', async function (req, res, next){
    try{
        const customer = await Customer.get(req.params.customerId);
        return res.json({customer});
    }catch (err){
        return next(err)
    }
});

router.post('/', async function(req, res, next){
    try {
        const customer = await Customer.register (req.body);
        return res.status(201).json(customer)
    }catch(err){
        return next(err)
    }
});

router.patch('/:customerId', async function(req, res, next){
    try {
        const customer = await Customer.update(req.params.customerId, req.body)
        return res.json({customer});
    }catch(err){
        return next(err)
    }
});

router.delete('/:customerId', async function (req, res, next){
    try{
        await Customer.remove(req.params.customerId);
        return res.json({deleted: req.params.customerId})
    }catch (err){
        return next(err)
    }
})

module.exports = router;