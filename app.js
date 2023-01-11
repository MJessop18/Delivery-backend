const express = require ('express');
const app = express();
const {NotFoundError} = require('./express-error');

const userRoutes = require ('./routes/users');

app.use(express.json());

app.get('/', (req,res) => {
    res.json({ hello : 'world'})
});

app.use ('/users', userRoutes);

//404 error handler 
app.use(function(req,res, next){
    return next(new NotFoundError());
});

//general error handler
app.use(function(err,req,res,next){
    if (process.eventNames.NODE_EMV !== 'test') console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
    
    return res.status(status).json({
        error: {message, status}
    });
});

module.exports = app;