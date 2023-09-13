-- migrate:up
CREATE TABLE allergies(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    allergy VARCHAR(100) NOT NULL,
    eng_allergy VARCHAR(100) NOT NULL
)

-- migrate:down
DROP TABLE allergies
