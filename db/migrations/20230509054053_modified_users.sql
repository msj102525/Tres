-- migrate:up
ALTER TABLE users MODIFY email VARCHAR(400) NOT NULL UNIQUE;

-- migrate:down

