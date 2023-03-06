const express = require ('express');
const Employee = require ('../models/employee')
const Router = require('express');
const {ensureDriver, ensureManager, driverOnly} = require('../../middleware/auth');
const { createToken } = require('../../middleware/tokens');

const router = express.Router();

router.get('/all', ensureManager, async function(req, res, next){
    
    try {
        const employee = await Employee.getAll();
        return res.json({employee})
    }catch(err){
        return next(err)
    }
});

router.post('/', async function(req, res, next){
    try {
        const employee = await Employee.register (req.body);
        return res.status(201).json(employee)
    }catch(err){
        return next(err)
    }
});

router.get('/:employeeId', ensureDriver, async function (req, res, next){
    try{
        const employee = await Employee.get(req.params.employeeId);
        return res.json({employee});
    }catch (err){
        return next(err)
    }
});

router.patch("/:employeeId/manager", ensureManager, async function (req, res, next){
    try {
        const employee = await Employee.promoteToManager(req.params.employeeId);
        return res.json({employee});
    }catch(err){
        return next(err)
    }
});

router.patch('/:employeeId', driverOnly, async function(req, res, next){
    try {
        const employee = await Employee.update(req.params.employeeId, req.body)
        return res.json({employee});
    }catch(err){
        return next(err)
    }
});

router.patch('/:employeeId/demote', ensureManager, async function (req, res, next){
    try{
        const employee = await Employee.demote(req.params.employeeId)
        return res.json({employee});
    }catch(err){
        return next(err)
    }
});

router.patch('/:employeeId/inactive', ensureManager, async function (req, res, next){
    try{
        const employee = await Employee.makeInactive(req.params.employeeId)
        return res.json({employee});
    }catch(err){
        return next(err)
    }
});

router.delete('/:employeeId', ensureManager, async function (req, res, next){
    try{
        await Employee.remove(req.params.employeeId);
        return res.json({deleted: req.params.employeeId})
    }catch (err){
        return next(err)
    }
});

router.post('/login', async function(req,res,next){
    try{
        const{email, password} = req.body;
        const employee = await Employee.authenticate(email, password);
        const token = createToken(employee);
        console.log('accessToken', token);
        return res.json({token});
    }catch(err){
        return next(err);
    }
})
module.exports = router;