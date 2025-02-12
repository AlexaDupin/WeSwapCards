-- Verify wecards:wecards-schema on pg

BEGIN;

SELECT "id", "name"
FROM "explorer"
WHERE false;
SELECT "id", "name"
FROM "place"
WHERE false;
SELECT "id", "name", "number", "place_id"
FROM "card"
WHERE false;
SELECT "id", "explorer_id", "card_id", "duplicate"
FROM "explorer_has_cards"
WHERE false;

ROLLBACK;
