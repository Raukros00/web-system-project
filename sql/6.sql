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
VALUES (13, 5, 2, 8.90),
       (14, 7, 1, 60.00);
