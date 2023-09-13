-- migrate:up
CREATE TABLE allergy_foods(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    food_id INT DEFAULT NULL,
    allergy_id INT DEFAULT NULL,
    FOREIGN KEY (food_id) REFERENCES foods(id),
    FOREIGN KEY (allergy_id) REFERENCES allergies(id)
)

-- migrate:down
DROP TABLE allergy_foods
