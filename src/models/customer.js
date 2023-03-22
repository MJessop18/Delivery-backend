const db = require('../../db');
const { BadRequestError, NotFoundError } = require('../../express-error');
const bcrypt = require('bcrypt');
const {BCRYPT_WORK_FACTOR} = require('../../config');

class Customer{
      //SQL call to get all customers
      static async getAll (){
        const result = await db.query(
            `SELECT id, 
            email, 
            first_name AS firstName,
            last_name AS lastName,
            phone_number
            FROM customer`
        );
        
        return result.rows;
    }

      //searching for one customer using ID
      static async get(id){
        const customerRes = await db.query(
            `SELECT id,
            email,
            first_name AS firstName,
            last_name AS lastName,
            phone_number
            FROM customer
            WHERE customer.id = $1`,
            [id]
        );
        const customer = customerRes.rows[0];

        if(!customer) throw new NotFoundError('no user found');
        return customer
    }

     //add customer to customer table in DB
     static async register ({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber
    }) {
        //check for duplicate emails in database
        const duplicateCheck = await db.query(
            `SELECT email
             FROM customer
             WHERE email = $1`,
             [email]
        );
        if (duplicateCheck.rows[0]){
            throw new BadRequestError(`duplicate email: ${email}`)
        }
        try{
            const salt = await bcrypt.genSalt(BCRYPT_WORK_FACTOR);
            const hashedPassword = await bcrypt.hash(password, salt);
            password = hashedPassword;
        }catch(err){
            throw new BadRequestError(err);
        }
        
        const result = await db.query(
            `INSERT INTO customer
            (email, 
            password,
            first_name,
            last_name,
            phone_number)
            VALUES($1,$2,$3,$4,$5)
            RETURNING email,
            first_name AS firstName,
            last_name AS lastName,
            phone_number AS phoneNumber`,
            [email, password, firstName, lastName, phoneNumber]
        );
        const customer = result.rows[0];
        return customer
    }

    static async update(customerId, {
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        password
    }){
    let result;
    if (password !== undefined){
        try{
            const salt = await bcrypt.genSalt(BCRYPT_WORK_FACTOR);
            const hashedPassword = await bcrypt.hash(password, salt);
            password = hashedPassword;
            result = await db.query(
                `UPDATE customer
                SET email =$1,
                password =$2,
                first_name =$3,
                last_name =$4,
                phone_number =$5
                WHERE id = $6
                RETURNING email,
                first_name AS firstName,
                last_name AS lastName,
                phone_number AS phoneNumber`,
                [email, password, firstName, lastName, phoneNumber, customerId]
            )
            const customer = result.rows[0]
            return customer;
        }catch(err){
            throw new BadRequestError(err);
        }
    }else{
        try{
        result = await db.query(
            `UPDATE customer
            SET email =$1,
            first_name =$2,
            last_name =$3,
            phone_number =$4
            WHERE id = $5
            RETURNING email,
            first_name AS firstName,
            last_name AS lastName,
            phone_number AS phoneNumber`,
            [email, firstName, lastName, phoneNumber, customerId]
        )
        const customer = result.rows[0]
        return customer;
    }catch(err){
        throw new BadRequestError(err);
    }
}
}

    static async remove(customerId){
        let result = await db.query(
            `DELETE
            FROM customer
            WHERE id = $1
            RETURNING first_name AS firstName`,
            [customerId]
        );
        const customer = result.rows[0];
        if (!customer) throw new NotFoundError('no user found');
    }

    static async authenticate(email, password){
        const result = await db.query(
            `SELECT id,
            email,
            password,
            first_name AS firstName,
            last_name AS lastName,
            phone_number AS phoneNumber
            FROM customer
            WHERE email = $1`,
            [email]
        );
        const customer = result.rows[0];
        console.log('customer', customer)
        if(customer){
            const isValid = await bcrypt.compare(password, customer.password);
            console.assert(isValid, 'invalid username/password');
            if(isValid === true){
                delete customer.password;
                return customer
            }
        }
        throw new UnauthorizedError('invalid username/password'); 
        }

}
module.exports = Customer;