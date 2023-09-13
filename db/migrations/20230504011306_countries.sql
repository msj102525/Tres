-- migrate:up
CREATE TABLE countries(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(100) NOT NULL,
    eng_country VARCHAR(100) NOT NULL,
    continent_id int NOT NULL,
    FOREIGN KEY(continent_id) REFERENCES continents(id)
)

-- migrate:down
DROP TABLE countries
