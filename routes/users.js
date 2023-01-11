const express = require ('express');
const {BadRequestError} = require ('../express-error');
const Users = require ('../models/users');
const {createToken} = require ('../middleware/tokens');
const jsonschema = require ('jsonschema');
const newUserSchema = require ('../schemas/new-user.json');
const router = express.Router();

router.post ('/sign-up', async function(req,res,next){
    try{
        const validator = jsonschema.validate(req.body, newUserSchema);
        if(!validator.valid){
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }
        const newUser = await Users.create({
            ...req.body,
            role: customer
        });
        const token = createToken(newUser);
        return res.status(201).json({token});
    }catch(err){
        return next(err)
    }
});

module.exports = router;