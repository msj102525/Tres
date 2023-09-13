-- migrate:up
CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(400) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(200) NOT NULL,
    address_id INT NOT NULL,
    phone_number VARCHAR(200) NOT NULL,
    gender VARCHAR(100) NOT NULL,
    points DECIMAL(12,2) NOT NULL DEFAULT 0,
    birth_date DATE DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(address_id) REFERENCES addresses(id)
)

-- migrate:down
DROP TABLE users
