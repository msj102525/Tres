-- migrate:up
CREATE TABLE food_images(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    food_image VARCHAR(2000) NOT NULL
)

-- migrate:down
DROP TABLE food_images
