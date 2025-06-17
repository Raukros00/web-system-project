CREATE TABLE spare_part (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    part_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO spare_part (part_name, quantity, price)
VALUES
    ('Filtro olio', 30, 15.00),
    ('Candela accensione', 50, 8.50),
    ('Pastiglie freno', 40, 20.00),
    ('Cinghia', 25, 30.00),
    ('Batteria', 15, 55.00),
    ('Faro anteriore', 10, 70.00),
    ('Pneumatico anteriore', 20, 100.00),
    ('Pneumatico posteriore', 20, 110.00),
    ('Specchietto sinistro', 12, 25.00),
    ('Specchietto destro', 12, 25.00),
    ('Catena trasmissione', 18, 45.00),
    ('Centralina', 5, 150.00),
    ('Ammortizzatore', 8, 95.00),
    ('Guarnizione testata', 20, 12.00),
    ('Olio motore', 50, 10.00),
    ('Filtro aria', 30, 18.00),
    ('Pompa freno', 6, 60.00),
    ('Frizione', 9, 120.00),
    ('Supporto faro', 14, 22.00),
    ('Kit tagliando', 20, 80.00);
