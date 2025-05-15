CREATE TABLE vehicle (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nameplate VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    customer_id BIGINT,
    CONSTRAINT fk_vehicle_customer FOREIGN KEY (customer_id) REFERENCES customer(id)
);

INSERT INTO vehicle (nameplate, brand, model, customer_id)
VALUES
    ('AA123BB', 'Yamaha', 'MT-09', 1),
    ('CC234DD', 'Honda', 'CB650R', 2),
    ('EE345FF', 'Kawasaki', 'Ninja 650', 3),
    ('GG456HH', 'Ducati', 'Scrambler Icon', 4),
    ('II567JJ', 'Suzuki', 'GSX-S750', 5),
    ('KK678LL', 'BMW', 'F 900 R', 6),
    ('MM789NN', 'Triumph', 'Bonneville T100', 7),
    ('OO890PP', 'Aprilia', 'RS 660', 8),
    ('QQ901RR', 'Moto Guzzi', 'V85 TT', 9),
    ('SS012TT', 'Harley-Davidson', 'Street Bob 114', 10);