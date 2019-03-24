-- Drop the bamazon_db if it exists already
DROP DATABASE IF EXISTS bamazon_db;
-- Creates the "bamazon_db" database
CREATE DATABASE bamazon_db;

-- specify that all of the following code will affect bamazon_db
USE bamazon_db;

-- create a table, called "products" within bamazon_db
CREATE TABLE products ( 
    -- create a numeric column called "item_id", which will automatically increment as we create new rows
    item_id INT AUTO_INCREMENT NOT NULL,
    -- create a string column called "product_name", which can't be null
    product_name VARCHAR(150) NOT NULL,
    -- create a string column called "department_name", which can't be null
    department_name VARCHAR(150) NOT NULL,
    -- create a numeric column called "price", which can't be null
    price DECIMAL(6,2) NOT NULL,
    -- create a numeric column called "stock_quantity", which can't be null
    stock_quantity INT NOT NULL,
    -- set the "item_id" column as the primary key, which means the data contained in it will be unique
    primary key(item_id)
);

-- insert data to the "products" table
INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES 
("Backpack", "Hiking/Backpacking", 119.99, 15),
("Hiking shoes", "Hiking/Backpacking", 75, 6),
("Life jackets", "Sailing/Canoeing", 39.99, 23),
("Water filter", "Hiking/Backpacking", 19.97, 14),
("Carabiner", "Climbing", 10.99, 57),
("Canoe", "Sailing/Canoeing", 1344.99, 3),
("Harness", "Climbing", 47.75, 45),
("Freeze dried Meals", "Hiking/Backpacking", 4.99, 129),
("Winter hat", "Snow", 20, 43),
("Goggles", "Snow", 60, 16);