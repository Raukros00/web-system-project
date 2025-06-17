CREATE TABLE practice (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(255),
    problem_description TEXT,
    work_description TEXT,
    total_hours DOUBLE DEFAULT 0,
    vehicle_id BIGINT,
    customer_id BIGINT,
    total_price DECIMAL(10, 2) DEFAULT 0.0 NOT NULL,
    manpower_cost DECIMAL(10, 2) DEFAULT 0.0 NOT NULL,
    CONSTRAINT fk_practice_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicle(id),
    CONSTRAINT fk_practice_customer FOREIGN KEY (customer_id) REFERENCES customer(id)
);

INSERT INTO practice (status, problem_description, work_description, total_hours, vehicle_id, customer_id, total_price, manpower_cost)
VALUES
    ('ACCEPTED', 'Problema accensione', 'Diagnosi iniziale', 1.5, 1, 1, 90.00, 50.00),
    ('IN_PROGRESS', 'Cambio olio', 'Sostituito filtro e olio', 2.0, 2, 2, 140.00, 50.00),
    ('TO_PAY', 'Freni rumorosi', 'Cambio pastiglie', 3.0, 3, 3, 158.00, 50.00),
    ('COMPLETED', 'Tagliando completo', 'Tagliando 10k', 4.0, 4, 4, 230.00, 50.00),
    ('ACCEPTED', 'Catena allentata', 'Registrazione catena', 1.0, 5, 5, 105.00, 50.00),
    ('IN_PROGRESS', 'Problema luci', 'Sostituito faro', 2.5, 6, 6, 195.00, 50.00),
    ('TO_PAY', 'Gomme consumate', 'Sostituzione pneumatici', 3.5, 7, 7, 375.00, 50.00),
    ('COMPLETED', 'Batteria scarica', 'Cambio batteria', 1.5, 8, 8, 130.00, 50.00),
    ('ACCEPTED', 'Motore irregolare', 'Diagnosi e pulizia iniettori', 4.5, 9, 9, 320.00, 50.00),
    ('IN_PROGRESS', 'Problemi frenata', 'Controllo impianto', 3.0, 10, 10, 190.00, 50.00),
    ('TO_PAY', 'Cinghia rotta', 'Sostituzione cinghia', 2.0, 11, 11, 112.00, 50.00),
    ('COMPLETED', 'Check-up generale', 'Controlli di routine', 1.0, 12, 12, 80.00, 50.00),
    ('ACCEPTED', 'Sostituzione candela', 'Montata candela nuova', 0.5, 13, 13, 33.00, 50.00),
    ('IN_PROGRESS', 'Problemi elettronici', 'Controllo centralina', 3.0, 14, 14, 165.00, 50.00),
    ('TO_PAY', 'Tagliando 20k', 'Tagliando completo', 5.0, 15, 15, 330.00, 50.00),
    ('COMPLETED', 'Perdita olio', 'Riparata guarnizione', 2.0, 16, 16, 125.00, 50.00),
    ('ACCEPTED', 'Specchietto rotto', 'Sostituzione specchietto', 1.0, 17, 17, 95.00, 50.00),
    ('IN_PROGRESS', 'Problema alla frizione', 'Controllo e registrazione', 2.5, 18, 18, 245.00, 50.00),
    ('TO_PAY', 'Controllo ruote', 'Allineamento ruote', 1.5, 19, 19, 135.00, 50.00),
    ('COMPLETED', 'Controllo sospensioni', 'Revisionato ammortizzatore', 2.0, 20, 20, 122.00, 50.00);
