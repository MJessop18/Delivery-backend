const db = require('../../db');
const { BadRequestError, NotFoundError } = require('../../express-error');

class Order{
    static async getAll (){
        const result = await db.query(
            `SELECT id, 
            employee_id AS employeeId,
            customer_id AS customerId,
            pickup_address AS pickupAddress,
            delivery_address AS deliveryAddress,
            delivery_notes AS deliveryNotes,
            food_items AS foodItems
            FROM food_order`
    )
    return result.rows;
        };

        static async get(orderId){
            const result = await db.query(
                `SELECT id,
                employee_id AS employeeId,
                customer_id AS customerId,
                pickup_address AS pickupAddress,
                delivery_notes AS deliveryNotes,
                food_items AS foodItems
                FROM food_order
                WHERE id = $1`,
                [orderId]
            )
            return result.rows[0]
        };

        static async getItemizedOrder(orderId){
            const items = await db.query(
                `SELECT
                food_items
                FROM food_order
                WHERE id = $1`,
                [orderId]
            )
            return items.rows[0];
        };

        static async editFoodItems(orderId, newItems){
            const orderRes = await db.query(
                `UPDATE food_order
                SET food_items = $1
                WHERE id = $2
                RETURNING food_items`,
                [newItems, orderId]
            );
            const order = orderRes.rows;
            if(!order) throw new NotFoundError('no order found');
            return orderRes.rows[0];
        };

        static async createOrder({
            customer_id: customerId,
            food_items: foodItems,
            pickup_address: pickupAddress,
            delivery_address: deliveryAddress,
            delivery_notes: deliveryNotes,
            active_status: activeStatus
        }){
            let result = await db.query(
                `INSERT INTO food_order
                (customer_id, food_items, pickup_address, 
                    delivery_address, delivery_notes, active_status)
                VALUES($1, $2, $3, $4, $5, $6)
                RETURNING id, customer_id, food_items, 
                pickup_address, delivery_address, delivery_notes, active_status`,
                    [customerId, foodItems, pickupAddress, 
                        deliveryAddress, deliveryNotes, activeStatus]
            );
            const order = result.rows[0];
            return order;
        }

        static async archivedOrder(orderId,{ 
            customer_id: customerId,
            food_items: foodItems,
            pickup_address: pickupAddress,
            delivery_address: deliveryAddress,
            delivery_notes: deliveryNotes
        }){
            let result = await db.query(
                `INSERT INTO order_history
                (customer_id, 
                    order_id, 
                    food_items, 
                    pickup_address, 
                    delivery_address, 
                    delivery_notes)
                VALUES($1,$2,$3,$4,$5,$6)
                RETURNING id, 
                customer_id AS customerId, 
                order_id AS orderId, 
                food_items AS foodItems,
                pickup_address AS pickupAddress,
                delivery_address AS deliveryAddress,
                delivery_notes AS deliveryNotes`,
                [customerId, orderId, foodItems, 
                    pickupAddress, deliveryAddress, deliveryNotes]
            );
            const order = result.rows[0];
            return order;

        }

        static async remove(orderId){
            let result = await db.query(
                `DELETE
                FROM food_order
                WHERE id = $1
                RETURNING pickup_address,
                delivery_address`,
                [orderId]
            );
            const order = result.rows[0];
            if (!order) throw new NotFoundError('no order found');
        }
}
module.exports = Order;