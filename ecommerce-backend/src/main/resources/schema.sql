DROP TABLE IF EXISTS addresses;
CREATE TABLE IF NOT EXISTS addresses (
    id BIGINT NOT NULL AUTO_INCREMENT,
    zip_code INTEGER NOT NULL,
    city VARCHAR(255),
    country VARCHAR(255),
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(255),
    state VARCHAR(255),
    street VARCHAR(255),
    user_id VARCHAR(255),
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS orders;
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT NOT NULL AUTO_INCREMENT,
    amount FLOAT(53) NOT NULL,
    is_paid BOOLEAN NOT NULL,
    address VARCHAR(255),
    items TEXT,
    payment_type VARCHAR(255),
    status VARCHAR(255),
    user_id VARCHAR(255),
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS products;
CREATE TABLE IF NOT EXISTS products (
    id BIGINT NOT NULL AUTO_INCREMENT,
    in_stock BOOLEAN NOT NULL,
    offer_price FLOAT(53) NOT NULL,
    price FLOAT(53) NOT NULL,
    category VARCHAR(255),
    description TEXT,
    image TEXT,
    name VARCHAR(255),
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    cart_items TEXT,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    password VARCHAR(255),
    PRIMARY KEY (id)
);
