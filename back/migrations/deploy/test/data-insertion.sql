-- Deploy wecards:data-insertion to pg

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
('Séoul');

INSERT INTO "card" ("name", "number", "place_id") VALUES
('Bruxelles1', 1, 1),
('Bruxelles2', 2, 1),
('Bruxelles3', 3, 1),
('Bruxelles4', 4, 1),
('Bruxelles5', 5, 1),
('Bruxelles6', 6, 1),
('Bruxelles7', 7, 1),
('Bruxelles8', 8, 1),
('Bruxelles9', 9, 1),
('Berlin1', 1, 2),
('Berlin2', 2, 2),
('Berlin3', 3, 2),
('Berlin4', 4, 2),
('Berlin5', 5, 2),
('Berlin6', 6, 2),
('Berlin7', 7, 2),
('Berlin8', 8, 2),
('Berlin9', 9, 2);

INSERT INTO "explorer_has_cards" ("explorer_id", "card_id", "duplicate") VALUES
(1, 1, true), 
(1, 2, true), 
(1, 3, true);

COMMIT;
