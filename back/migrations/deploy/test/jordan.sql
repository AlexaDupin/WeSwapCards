-- Deploy wecards:jordan to pg

BEGIN;

-- INSERT INTO "place" ("name") VALUES
-- ('Jordanie');

SELECT * FROM insert_cards_placeName('Jordanie');

COMMIT;
