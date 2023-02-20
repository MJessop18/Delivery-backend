const db = require('../../db');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../../express-error');
const bcrypt = require('bcrypt');
const {BCRYPT_WORK_FACTOR} = require('../../config');

class Employee {
    //SQL call to get all employees
    static async getAll (){
        const result = await db.query(
            `SELECT id, 
            email, 
            first_name AS firstName,
            last_name AS lastName,
            role,
            phone_number AS phoneNumber,
            employee_rating
            FROM employee`
        );
        
        return result.rows;
    }
    //searching for one employee using ID
    static async get(id){
        const employeeRes = await db.query(
            `SELECT id,
            email,
            first_name AS firstName,
            last_name AS lastName,
            role,
            phone_number AS phoneNumber,
            employee_rating
            FROM employee
            WHERE employee.id = $1`,
            [id]
        );
        const employee = employeeRes.rows[0];

        if(!employee) throw new NotFoundError('no user found');
        return employee
    }

    //add employee to employee table in DB
    static async register ({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role,
        phone_number: phoneNumber
    }) {
        //check for duplicate emails in database
        const duplicateCheck = await db.query(
            `SELECT email
             FROM employee
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
            `INSERT INTO employee
            (email, 
            password,
            first_name,
            last_name,
            role,
            phone_number)
            VALUES($1,$2,$3,$4,$5,$6)
            RETURNING email,
            first_name AS firstName,
            last_name AS lastName,
            role;`,
            [email, password, firstName, lastName, role, phoneNumber]
        );
        const employee = result.rows[0];
        return employee
    }

    //given an ID update role to manager
    static async promoteToManager(employeeId){
        const employeeRes = await db.query(
            `UPDATE employee
            SET role = 'manager'
            WHERE id = $1
            RETURNING email,
            first_name AS firstName,
            last_name AS lastName,
            role;`,
            [employeeId]
        );
        const employee = employeeRes.rows;
        if(!employee) throw new NotFoundError('no employee found');
        return employee;
    }

    static async update(employeeId, {
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
                    `UPDATE employee
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
                    [email, password, firstName, lastName, phoneNumber, employeeId]
                )
                const employee = result.rows[0]
                return employee;
            }catch(err){
                throw new BadRequestError(err);
            }
        }else{
            try{
            result = await db.query(
                `UPDATE employee
                SET email =$1,
                first_name =$2,
                last_name =$3,
                phone_number =$4
                WHERE id = $5
                RETURNING email,
                first_name AS firstName,
                last_name AS lastName,
                phone_number AS phoneNumber`,
                [email, firstName, lastName, phoneNumber, employeeId]
            )
            const employee = result.rows[0]
            return employee;
        }catch(err){
            throw new BadRequestError(err);
        }
    }
}

static async demote(employeeId){
    let result = await db.query(
        `UPDATE employee
        SET role = 'driver'
        WHERE id = $1
        RETURNING first_name AS firstName,
        last_name AS lastName,
        role`,
        [employeeId]
    )
    const employee = result.rows[0]
    return employee;
}

static async makeInactive(employeeId){
    let result = await db.query(
        `UPDATE employee
        SET role = 'inactive'
        WHERE id = $1
        RETURNING first_name AS firstName,
        last_name AS lastName,
        role`,
        [employeeId]
    )
    const employee = result.rows[0]
    return employee;
}

    static async remove(employeeId){
        let result = await db.query(
            `DELETE
            FROM employee
            WHERE id = $1
            RETURNING first_name AS firstName`,
            [employeeId]
        );
        const employee = result.rows[0];
        if (!employee) throw new NotFoundError('no user found');
    }

    static async authenticate(email, password){
        const result = await db.query(
            `SELECT id,
            email,
            password,
            first_name AS firstName,
            last_name AS lastName,
            role,
            phone_number AS phoneNumber
            FROM employee
            WHERE email = $1`,
            [email]
        );
        const employee = result.rows[0];
        console.log('1',employee);
        if(employee){
            const isValid = await bcrypt.compare(password, employee.password);
            console.assert(isValid, 'invalid username/password');
            if(isValid === true){
                delete employee.password;
                return employee
            }
        }
        throw new UnauthorizedError('invalid username/password'); 
        }
    
}




module.exports = Employee;