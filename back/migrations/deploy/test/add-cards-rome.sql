-- Deploy wecards:add-cards-rome to pg

BEGIN;

SELECT * FROM insert_cards_placeName('Rome');

COMMIT;
