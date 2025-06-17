CREATE TABLE used_spare_parts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    practice_id BIGINT NOT NULL,
    spare_part_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price_at_use DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (practice_id) REFERENCES practice(id),
    FOREIGN KEY (spare_part_id) REFERENCES spare_part(id)
);

INSERT INTO used_spare_parts (practice_id, spare_part_id, quantity, price_at_use)
VALUES
    (1, 1, 1, 15.00),
    (2, 3, 2, 20.00),
    (3, 2, 1, 8.50),
    (4, 4, 1, 30.00),
    (5, 5, 1, 55.00),
    (6, 6, 1, 70.00),
    (7, 7, 2, 100.00),
    (8, 5, 1, 55.00),
    (9, 13, 1, 95.00),
    (10, 3, 2, 20.00),
    (11, 14, 1, 12.00),
    (12, 15, 3, 10.00),
    (13, 2, 1, 8.50),
    (14, 1, 1, 15.00),
    (15, 20, 1, 80.00),
    (16, 10, 1, 25.00),
    (17, 11, 1, 45.00),
    (18, 18, 1, 120.00),
    (19, 17, 1, 60.00),
    (20, 19, 1, 22.00);