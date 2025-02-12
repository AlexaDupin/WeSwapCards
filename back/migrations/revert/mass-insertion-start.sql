-- Revert wecards:mass-insertion-start from pg

BEGIN;

DELETE FROM "card";
DELETE FROM "place";
DELETE FROM "explorer";

COMMIT;
