CREATE TABLE customer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    birth_date DATE
);

INSERT INTO customer (first_name, last_name, phone_number, email, birth_date)
VALUES ('Mario', 'Rossi', '3456789012', 'mario.rossi@example.com', '1985-03-15'),
       ('Luca', 'Bianchi', '3491122334', 'luca.bianchi@example.com', '1990-07-22'),
        ('Giulia', 'Verdi', '3274455667', 'giulia.verdi@example.com', '1992-11-05'),
        ('Francesca', 'Neri', '3397788990', 'francesca.neri@example.com', '1988-01-30'),
        ('Alessandro', 'Moretti', '3201234567', 'alessandro.moretti@example.com', '1995-05-10'),
        ('Elena', 'Gallo', '3289988776', 'elena.gallo@example.com', '1993-12-17'),
        ('Paolo', 'Conti', '3312233445', 'paolo.conti@example.com', '1982-08-09'),
        ('Sara', 'Martini', '3366677889', 'sara.martini@example.com', '1998-04-03'),
        ('Davide', 'Romano', '3371122334', 'davide.romano@example.com', '1991-10-27'),
        ('Laura', 'De Luca', '3405566778', 'laura.deluca@example.com', '1987-06-12');
