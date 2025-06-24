USE workshopdb;

CREATE TABLE customer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    birth_date DATE
);

INSERT INTO customer (first_name, last_name, phone_number, email, birth_date)
VALUES
    ('Luca', 'Rossi', '3331234567', 'l.rossi@example.com', '1990-04-12'),
    ('Marco', 'Bianchi', '3479876543', 'm.bianchi@example.com', '1985-11-02'),
    ('Sara', 'Verdi', '3391231234', 's.verdi@example.com', '1992-07-23'),
    ('Anna', 'Neri', '3488887777', 'a.neri@example.com', '1994-01-05'),
    ('Giulia', 'Conti', '3345566778', 'g.conti@example.com', '1988-03-30'),
    ('Francesco', 'Fontana', '3367788990', 'f.fontana@example.com', '1991-09-15'),
    ('Marta', 'Ferri', '3311122233', 'm.ferri@example.com', '1995-05-19'),
    ('Giorgio', 'Villa', '3359988776', 'g.villa@example.com', '1982-12-10'),
    ('Lucia', 'Marino', '3402233445', 'l.marino@example.com', '1993-08-08'),
    ('Davide', 'Costa', '3496677889', 'd.costa@example.com', '1990-10-10'),
    ('Simone', 'Gentile', '3204455667', 's.gentile@example.com', '1987-06-17'),
    ('Chiara', 'Greco', '3245566777', 'c.greco@example.com', '1996-04-25'),
    ('Elisa', 'Caruso', '3271234560', 'e.caruso@example.com', '1989-02-14'),
    ('Alessandro', 'Gallo', '3287894561', 'a.gallo@example.com', '1991-11-11'),
    ('Silvia', 'Romano', '3293322110', 's.romano@example.com', '1993-03-03'),
    ('Paolo', 'Riva', '3215566778', 'p.riva@example.com', '1984-07-01'),
    ('Ilaria', 'Mancini', '3223344556', 'i.mancini@example.com', '1992-05-20'),
    ('Tommaso', 'Ferrari', '3261234567', 't.ferrari@example.com', '1986-01-09'),
    ('Andrea', 'Esposito', '3237890123', 'a.esposito@example.com', '1983-10-18'),
    ('Serena', 'Lombardi', '3259988776', 's.lombardi@example.com', '1990-09-09');

