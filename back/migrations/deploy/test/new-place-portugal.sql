-- Deploy wecards:new-place-portugal to pg

BEGIN;

INSERT INTO "place" ("name") VALUES
('Portugal');

SELECT * FROM insert_cards_placeName('Portugal');

UPDATE place
SET name = 'Égypte'
WHERE name = 'Egypte';

UPDATE card
SET name = 'Égypte1'
WHERE name = 'Egypte1';

UPDATE card
SET name = 'Égypte2'
WHERE name = 'Egypte2';

UPDATE card
SET name = 'Égypte3'
WHERE name = 'Egypte3';

UPDATE card
SET name = 'Égypte4'
WHERE name = 'Egypte4';

UPDATE card
SET name = 'Égypte5'
WHERE name = 'Egypte5';

UPDATE card
SET name = 'Égypte6'
WHERE name = 'Egypte6';

UPDATE card
SET name = 'Égypte7'
WHERE name = 'Egypte7';

UPDATE card
SET name = 'Égypte8'
WHERE name = 'Egypte8';

UPDATE card
SET name = 'Égypte9'
WHERE name = 'Egypte9';

COMMIT;
