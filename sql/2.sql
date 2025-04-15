CREATE TABLE customer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fist_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    birth_date DATE
);