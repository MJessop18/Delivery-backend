const express = require ('express');
const cors = require ('cors');
const app = express();
const {NotFoundError} = require('./express-error');

const employeeRoutes = require ('./src/routes/employee');
const customerRoutes = require ('./src/routes/customer');
const orderRoutes = require ('./src/routes/order');

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.json({ hello : 'world'})
});

app.use('/employee', employeeRoutes)
app.use('/customer', customerRoutes)
app.use('/order', orderRoutes)

//404 error handler 
app.use(function(req,res, next){
    return next(new NotFoundError());
});

//general error handler


module.exports = app;