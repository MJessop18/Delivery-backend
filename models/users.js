const db = require('../db');
const bcrypt = require('bcrypt');
const {NotFoundError, BadRequestError, UnauthorizedError} = require('../express-error');
const {BCRYPT_WORK_FACTOR} = require('../config');

class Users{
    //authenticate users with email and password
    //returns{first_name, last_name, email, created_at, role}
    //throws unauthorized error if user not found or wrong password 
    static async authenticate(email, password){
        const result = await db.query(
            `SELECT id,
                email,
                first_name AS firstName,
                last_name AS lastName,
                role
            FROM users
            WHERE email = $1`,
            [email]
        );

        const user = result.rows[0];
        console.assert(!!user,`no user with email "${email}" found`);

        if (user){
            const isValid = await bcrypt.compare(password, user.password);
            console.assert(isValid, 'invalid email or password');
            if (isValid === true){
                delete user.password;
                return user
            }
        }
        throw new UnauthorizedError('invalid email or password');
    }

    static async create({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role
    }) {
        //check email availability 
        const duplicateCheck = await db.query(
            `SELECT email
            FROM Users
            WHERE email = $1`,
            [email]
        );

        if (duplicateCheck.rows[0]){
            throw new BadRequestError(`email already registered: ${email}`);
        }

        //hashes passwords using work factor
        const hashPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT into Users
            (email, password, first_name, last_name, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING email, first_name AS firstName, last_name AS lastName, role`,
            [email, hashPassword, firstName, lastName, role]
        );

        const user = result.rows[0];
        return user;
    }
}
module.exports = Users;