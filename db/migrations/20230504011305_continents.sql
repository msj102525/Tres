-- migrate:up
CREATE TABLE continents(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    continent VARCHAR(100) NOT NULL,
    eng_continent VARCHAR(100) NOT NULL
)

-- migrate:down
DROP TABLE continents
