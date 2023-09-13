-- migrate:up
CREATE TABLE meat_foods(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    food_id INT NOT NULL,
    meat_id INT NOT NULL,
    FOREIGN KEY (food_id) REFERENCES foods(id),
    FOREIGN KEY (meat_id) REFERENCES meats(id)
)

-- migrate:down
DROP TABLE meat_foods
