-- Revert wecards:mass-insertion from pg

BEGIN;

DELETE FROM "card";
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

DELETE FROM "place" 
WHERE name = 'Mongolie'
AND name = 'Buenos Aires'
AND name = 'Écosse';

COMMIT;
