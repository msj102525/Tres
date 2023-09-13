-- migrate:up
ALTER TABLE orders MODIFY order_number VARCHAR(300) NULL;

ALTER TABLE orders MODIFY order_status_id INT DEFAULT 1;

-- migrate:down

