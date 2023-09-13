-- migrate:up
CREATE TABLE country_user(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    country_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
)

-- migrate:down
DROP TABLE country_user
