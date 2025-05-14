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
