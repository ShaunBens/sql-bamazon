DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT (100) NOT NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone", "Electronics", 999, 100),
("iPad", "Electronics", 599, 75),
("MacBook Pro", "Electronics", 1995, 150),
("iMac", "Electronics", 2550, 300),
("Apple TV", "Electronics", 99, 30),

("Nike Shoes", "Clothing", 69, 40),
("Adidas", "Clothing", 59, 55),
("Fila", "Clothing", 49, 60),
("Converse Classics", "Clothing", 199, 25),

("Fossil", "Watches", 299, 43),
("Casio", "Watches", 199, 60),
("Rolex", "Watches", 599, 25),

("Diamonds", "Jewelry", 1995, 15),
("Bracelet", "Jewelry", 45, 20),
("Gold", "Jewelry", 399, 23);