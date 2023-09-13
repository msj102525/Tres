-- migrate:up
ALTER TABLE orders DROP FOREIGN KEY orders_ibfk_1;

ALTER TABLE orders DROP COLUMN order_status_id;

ALTER TABLE order_items ADD COLUMN order_status_id INT NOT NULL DEFAULT 1 AFTER food_id;

ALTER TABLE order_items ADD CONSTRAINT oi_status_fk FOREIGN KEY (order_status_id) REFERENCES order_status(id)
-- migrate:down

