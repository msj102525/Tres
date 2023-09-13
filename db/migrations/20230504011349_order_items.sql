-- migrate:up
CREATE TABLE order_items(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    order_count INT NOT NULL DEFAULT 0,
    food_id INT NOT NULL,
    FOREIGN KEY (food_id) REFERENCES foods(id)
)

-- migrate:down
DROP TABLE order_items
