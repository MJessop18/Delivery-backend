const jwt = require("jsonwebtoken");
const SECRET_KEY = require ('../config');
const { UnauthorizedError } = require("../express-error");
const Employee = require("../src/models/employee");


async function getEmpForToken(req){
    const authHeader = req.body && req.body.Authorization;
    console.log('2', authHeader)
    if(!authHeader){
        console.log('authHeader not supplied');
        return;
    }
    const token = authHeader.replace(/^[Bb]earer /, '').trim();
    console.log('4', token)
    const parsedToken = jwt.verify(authHeader, SECRET_KEY);
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
    try{
        console.log('3', req)
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

module.exports = {ensureDriver};