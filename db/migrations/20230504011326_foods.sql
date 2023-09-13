-- migrate:up
CREATE TABLE foods(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    food VARCHAR(200) NOT NULL,
    eng_food VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    vegetarian VARCHAR(100) NOT NULL,
    country_id INT NOT NULL,
    food_image_id INT DEFAULT NULL,
    spice_level INT NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    eng_description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULl DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    FOREIGN KEY (food_image_id) REFERENCES food_images(id)
)

-- migrate:down
DROP TABLE foods
