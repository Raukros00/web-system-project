USE workshopdb;

CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(255) NOT NULL
);

INSERT INTO user (username, password, first_name, last_name, email, role)
VALUES ('admin', '$2a$10$is9nZNkh9qHrORYxn9Q8jOYeM4eSM19ZMXqXd369tDduzyQ8N/7pm', 'Alessandro', 'Dominici', 'admin@mail.it', 'ADMIN'),
       ('meccanico', '$2a$10$is9nZNkh9qHrORYxn9Q8jOYeM4eSM19ZMXqXd369tDduzyQ8N/7pm', 'Alessandro', 'Dominici', 'meccanico@mail.it', 'MECHANIC'),
       ('magazziniere', '$2a$10$is9nZNkh9qHrORYxn9Q8jOYeM4eSM19ZMXqXd369tDduzyQ8N/7pm', 'Alessandro', 'Dominici', 'magazziniere@mail.it', 'WAREHOUSE_WORKER'),
       ('cassiere', '$2a$10$is9nZNkh9qHrORYxn9Q8jOYeM4eSM19ZMXqXd369tDduzyQ8N/7pm', 'Alessandro', 'Dominici', 'cassiere@mail.it', 'CASHIER'),
       ('accettazione', '$2a$10$is9nZNkh9qHrORYxn9Q8jOYeM4eSM19ZMXqXd369tDduzyQ8N/7pm', 'Alessandro', 'Dominici', 'accettazione@mail.it', 'ACCEPTANCE_AGENT');


