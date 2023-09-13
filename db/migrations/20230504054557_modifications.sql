-- migrate:up
-- ALTER TABLE foods DROP CONSTRAINT food_image_id;
ALTER TABLE foods DROP FOREIGN KEY foods_ibfk_2;

ALTER TABLE foods DROP COLUMN food_image_id;

ALTER TABLE food_images ADD COLUMN food_id INT NOT NULL AFTER food_image;

ALTER TABLE food_images ADD CONSTRAINT fk_images FOREIGN KEY (food_id) REFERENCES foods(id);


-- migrate:down

