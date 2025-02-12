-- Deploy wecards:new_place to pg

BEGIN;

INSERT INTO "place" ("name") VALUES
('EnterNewPlace');

SELECT * FROM insert_cards_placeName('EnterNewPlace');

COMMIT;
