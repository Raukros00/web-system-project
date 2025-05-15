CREATE TABLE practice (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(255),
    problem_description TEXT,
    work_description TEXT,
    total_hours DOUBLE DEFAULT 0,
    vehicle_id BIGINT,
    customer_id BIGINT,
    CONSTRAINT fk_practice_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicle(id),
    CONSTRAINT fk_practice_customer FOREIGN KEY (customer_id) REFERENCES customer(id)
);

INSERT INTO practice (status, problem_description, work_description, total_hours, vehicle_id, customer_id)
VALUES ('ACCEPTED', 'Rumore anomalo proveniente dal motore', NULL, 0, 1, 1),
       ('ACCEPTED', 'La moto non si avvia a freddo', NULL, 0, 2, 2),
       ('ACCEPTED', 'Perdita d’olio nella zona del carter', NULL, 0, 3, 3);

INSERT INTO practice (status, problem_description, work_description, total_hours, vehicle_id, customer_id)
VALUES ('IN_PROGRESS', 'Controllo generale prima del viaggio', 'Controllo olio, freni e pressione gomme', 1.5, 4, 4),
       ('IN_PROGRESS', 'Freni poco reattivi', 'Sostituzione pastiglie anteriori e spurgo impianto', 2.0, 5, 5),
       ('IN_PROGRESS', 'Rumore proveniente dalla catena', 'Tensione catena e lubrificazione', 1.0, 6, 6);

INSERT INTO practice (status, problem_description, work_description, total_hours, vehicle_id, customer_id)
VALUES ('COMPLETED', 'Tagliando completo', 'Cambio olio, filtro aria e candela', 2.5, 7, 7),
       ('COMPLETED', 'Problemi all’accensione', 'Sostituzione batteria e controllo impianto elettrico', 1.8, 8, 8),
       ('COMPLETED', 'Sospensioni rigide', 'Revisione forcella anteriore e sostituzione olio', 3.2, 9, 9),
       ('COMPLETED', 'Sostituzione pneumatici', 'Montaggio gomme nuove e bilanciatura', 1.5, 10, 10);
