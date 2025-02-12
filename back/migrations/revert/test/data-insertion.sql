-- Revert wecards:data-insertion from pg

BEGIN;

DELETE FROM "explorer_has_cards";
DELETE FROM "card";
DELETE FROM "place";
DELETE FROM "explorer";

COMMIT;
