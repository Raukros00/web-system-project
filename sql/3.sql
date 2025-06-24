USE workshopdb;

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
    ('AA001AA', 'Yamaha', 'MT-07', 1),
    ('BB002BB', 'Honda', 'CB500F', 2),
    ('CC003CC', 'Ducati', 'Monster 821', 3),
    ('DD004DD', 'Kawasaki', 'Z650', 4),
    ('EE005EE', 'BMW', 'F900R', 5),
    ('FF006FF', 'Suzuki', 'GSX-S750', 6),
    ('GG007GG', 'Yamaha', 'Tracer 7', 7),
    ('HH008HH', 'Honda', 'Africa Twin', 8),
    ('II009II', 'Ducati', 'Scrambler', 9),
    ('JJ010JJ', 'Kawasaki', 'Versys 650', 10),
    ('KK011KK', 'BMW', 'R1250R', 11),
    ('LL012LL', 'Suzuki', 'V-Strom 650', 12),
    ('MM013MM', 'Yamaha', 'XSR700', 13),
    ('NN014NN', 'Honda', 'CB650R', 14),
    ('OO015OO', 'Ducati', 'Panigale V2', 15),
    ('PP016PP', 'Kawasaki', 'Ninja 650', 16),
    ('QQ017QQ', 'BMW', 'S1000R', 17),
    ('RR018RR', 'Suzuki', 'SV650', 18),
    ('SS019SS', 'Yamaha', 'MT-09', 19),
    ('TT020TT', 'Honda', 'Rebel 500', 20);
