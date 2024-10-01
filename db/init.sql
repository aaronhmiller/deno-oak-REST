CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);
INSERT INTO items (name, description)
VALUES ('Item A', 'An amazing item'), ('Item B', 'A beautiful item'), ('Item C', 'A cool item');
