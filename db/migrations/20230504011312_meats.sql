-- migrate:up
CREATE TABLE meats(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    meat VARCHAR(100) NOT NULL,
    eng_meat VARCHAR(100) NOT NULL
)

-- migrate:down
DROP TABLE meats
