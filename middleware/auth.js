const jwt = require("jsonwebtoken");
const SECRET_KEY = require ('../config');
const { UnauthorizedError } = require("../express-error");
const Employee = require("../src/models/employee");


async function getEmpForToken(req){
    const authHeader = req.header && req.header.authorization;
    console.log('authhead',authHeader);
    if(!authHeader){
        console.log('authHeader not supplied');
        return;
    }
    const token = authHeader.replace(/^[Bb]earer /, '').trim();
    const parsedToken = jwt.verify(token, SECRET_KEY.SECRET_KEY);
    if(
        typeof parsedToken !== 'object' || 
        parsedToken === null ||
        typeof parsedToken.userId !== 'number'
    ){
        console.log('token payload invalid', parsedToken);
        return;
    }
    try{
        return await Employee.get(parsedToken.userId);
    }catch(err){
        console.log('failure reading employee', err)
        return;
    }
}

//middleware to check if employee is a driver. If not throw unauthorized.

async function ensureDriver(req,res,next){
    console.log('req1', req.header.authorization);
    try{
        const employee = await getEmpForToken(req.header);
        if(employee){
            const role = employee.role;
            if(role === 'driver' || role === 'manager'){
                return next();
            }
        }
        throw new UnauthorizedError()
    }catch(err){
        return next(err);
    }
}

async function ensureManager(req, res, next){
    try{
        const employee = await getEmpForToken(req);
        if(employee){
            const role = employee.role;
            if(role === 'manager'){
                return next();
            }
        }
        throw new UnauthorizedError()
    }catch(err){
        return next(err);
    }
}

async function driverOnly(req,res,next){
    try{
        const employee = await getEmpForToken(req);
        if(employee){
            const role = employee.role;
            if(role === 'driver' || role === 'manager'){
                return next();
            }
        }
        throw new UnauthorizedError()
    }catch(err){
        return next(err);
    }
}

module.exports = {ensureDriver, ensureManager, driverOnly};