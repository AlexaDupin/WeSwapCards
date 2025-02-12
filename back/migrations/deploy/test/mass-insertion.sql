-- Deploy wecards:mass-insertion to pg

BEGIN;

SELECT * FROM insert_place('Écosse');
SELECT * FROM insert_place('Buenos Aires');
SELECT * FROM insert_place('Mongolie');

DELETE FROM "explorer_has_cards";

DELETE FROM "card";
SELECT * FROM insert_allCards();

COMMIT;
