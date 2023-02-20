DROP DATABASE IF EXISTS deliverydb;

CREATE DATABASE deliverydb;

\c deliverydb;

CREATE TYPE authRole AS ENUM ('driver', 'manager', 'inactive');

CREATE TABLE employee(
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(15),
    last_name VARCHAR(20),
    role authRole NOT NULL,
    phone_number TEXT NOT NULL,
    employee_rating INTEGER
);

CREATE TABLE customer(
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(15),
    last_name VARCHAR(20),
    phone_number TEXT NOT NULL
);

CREATE TABLE food_order(
    id SERIAL PRIMARY KEY,
    employee_id INTEGER
        REFERENCES employee ON DELETE CASCADE,
    customer_id INTEGER
        REFERENCES customer ON DELETE CASCADE,
    food_items TEXT NOT NULL,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_notes VARCHAR(250),
    active_status BOOLEAN
);

CREATE TABLE order_history(
    id SERIAL PRIMARY KEY,
    customer_id INTEGER
        REFERENCES customer ON DELETE CASCADE,
    order_id INTEGER
        REFERENCES food_order ON DELETE CASCADE,
    food_items TEXT NOT NULL,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_notes VARCHAR(250),
    food_score INTEGER,
    driver_score INTEGER
);

INSERT INTO employee
    (email, password, first_name, last_name, role, phone_number, employee_rating)
VALUES 
    ('fake-email123@email.com', 'epic-password', 'George', 'Smith', 'driver', '000-000-0000', 6.2);

INSERT INTO employee
    (email, password, first_name, last_name, role, phone_number, employee_rating)
VALUES 
    ('coolemailname@email.com', 'super-epic-password', 'John', 'Doe', 'manager', '123-456-7890', 10);

INSERT INTO employee
    (email, password, first_name, last_name, role, phone_number, employee_rating)
VALUES 
    ('realemailaddress@email.com', 'super-duper-epic-password', 'Mark', 'Zuckerberg', 'driver', '111-222-3333', 2.5);

INSERT INTO customer
    (email, password, first_name, last_name, phone_number)
VALUES
    ('blahblahblah@blahmail.com', 'not-epic-password', 'Tommy', 'Hilfiger', '310-123-4567');

INSERT INTO customer
    (email, password, first_name, last_name, phone_number)
VALUES
    ('superrealemail@definitelyreal.com', 'really-not-epic-password', 'Brent', 'Hogan', '800-800-8000');

    INSERT INTO customer
    (email, password, first_name, last_name, phone_number)
VALUES
    ('ricksanchez@spaceman.com', 'extremely-not-epic-epic-password', 'Rick', 'Sanchez', '787-900-9000');

INSERT INTO food_order
    (employee_id, customer_id, food_items, pickup_address, delivery_address, delivery_notes, active_status)
VALUES 
    (1, 1, 'Bean and cheese burrito, Chips & Salsa, medium Horchata', '123 Fake street, 90210, CA', '654 Real street, 90210, CA', 'leave at door', true);

INSERT INTO food_order
    (employee_id, customer_id, food_items, pickup_address, delivery_address, delivery_notes, active_status)
VALUES 
    (2, 2, 'Cheeseburger, french fries, small Sprite', '125 Fake street, 90266, CA', '658 Real street, 90266, CA', 'extra ranch', true);

INSERT INTO food_order
    (employee_id, customer_id, food_items, pickup_address, delivery_address, delivery_notes, active_status)
VALUES 
    (3, 3, 'large Coca-cola', '129 Fake street, 90250, CA', '650 Real street, 90250, CA', 'ring bell', true);

INSERT INTO order_history
    (customer_id, order_id, food_items, pickup_address, delivery_address, delivery_notes, food_score, driver_score)
VALUES 
    (1,1,'Bean and cheese burrito, Chips & Salsa, medium Horchata', '123 Fake street, 90210, CA', '654 Real street, 90210, CA', 'leave at door', 7,2.5);

INSERT INTO order_history
    (customer_id, order_id, food_items, pickup_address, delivery_address, delivery_notes, food_score, driver_score)
VALUES 
    (2,2, 'Cheeseburger, french fries, small Sprite', '125 Fake street, 90266, CA', '658 Real street, 90266, CA', 'extra ranch', 4.3,6);

INSERT INTO order_history
    (customer_id, order_id, food_items, pickup_address, delivery_address, delivery_notes, food_score, driver_score)
VALUES 
    (3,3, 'large Coca-cola', '129 Fake street, 90250, CA', '650 Real street, 90250, CA', 'ring bell', 10,10);
