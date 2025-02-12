-- Deploy wecards:mass-insertion-start to pg

BEGIN;

INSERT INTO "explorer" ("name") VALUES
('Alexa'), ('Tiffany'), ('Anaëlle');

INSERT INTO "place" ("name") VALUES
('Bruxelles'), 
('Berlin'), 
('Rio de Janeiro'),
('Tokyo'), 
('New York'), 
('Australie'),
('Londres'), 
('Montréal'), 
('Egypte'),
('Nouvelle-Orléans'), 
('Pérou'), 
('Finlande'),
('Vietnam'), 
('Venise'), 
('Paris'),
('Hawaï'), 
('Oslo'), 
('Barcelone'),
('Inde'), 
('Afrique du Sud'),
('Global Walk Cup'), 
('Maroc'), 
('Grèce'),
('Mexico'), 
('Séoul'),
('Écosse'),
('Buenos Aires'),
('Mongolie');

SELECT * FROM insert_allCards();

COMMIT;
