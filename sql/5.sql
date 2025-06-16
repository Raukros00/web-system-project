CREATE TABLE spare_part (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    part_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO spare_part (part_name, quantity, price)
VALUES ('Freni anteriori', 10, 45.50),
       ('Filtro olio', 25, 8.90),
        ('Cinghia distribuzione', 5, 75.00),
        ('Batteria 12V', 7, 60.00),
        ('Candele accensione', 40, 3.20),
        ('Pneumatico estivo', 12, 89.99),
        ('Dischi freno posteriori', 6, 52.30),
        ('Specchietto retrovisore', 8, 25.00),
        ('Faro anteriore', 4, 110.75),
        ('Pastiglie freno', 20, 30.00);
