DROP TABLE IF EXISTS figuras CASCADE;
CREATE TABLE figuras(id serial PRIMARY KEY, name VARCHAR(20), coordenadas VARCHAR(50), offsetX integer, rotaciones integer, center VARCHAR(10));