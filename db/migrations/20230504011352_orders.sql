-- migrate:up
CREATE TABLE orders(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(300) NOT NULL,
    order_status_id INT NOT NULL,
    user_id INT NOT NULL,
    order_items_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_status_id) REFERENCES order_status(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_items_id) REFERENCES order_items(id)
)

-- migrate:down
DROP TABLE orders
