const express = require ('express');
const Employee = require ('../models/employee')
const Router = require('express');
const {ensureDriver} = require('../../middleware/auth');
const { createToken } = require('../../middleware/tokens');

const router = express.Router();

router.get('/all', async function(req, res, next){
    
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

router.patch("/:employeeId/manager", async function (req, res, next){
    try {
        const employee = await Employee.promoteToManager(req.params.employeeId);
        return res.json({employee});
    }catch(err){
        return next(err)
    }
});

router.patch('/:employeeId', async function(req, res, next){
    try {
        const employee = await Employee.update(req.params.employeeId, req.body)
        return res.json({employee});
    }catch(err){
        return next(err)
    }
});

router.patch('/:employeeId/demote', async function (req, res, next){
    try{
        const employee = await Employee.demote(req.params.employeeId)
        return res.json({employee});
    }catch(err){
        return next(err)
    }
});

router.patch('/:employeeId/inactive', async function (req, res, next){
    try{
        const employee = await Employee.makeInactive(req.params.employeeId)
        return res.json({employee});
    }catch(err){
        return next(err)
    }
});

router.delete('/:employeeId', async function (req, res, next){
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
        console.log(email, password)
        const employee = await Employee.authenticate(email, password);
        const accessToken = createToken(employee);
        return res.json({accessToken});
    }catch(err){
        return next(err);
    }
})
module.exports = router;