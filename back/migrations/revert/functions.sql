-- Revert wecards:functions from pg

BEGIN;

DROP FUNCTION insert_allCards(), 
insert_cards_placeName(text),
insert_cards_placeId(integer),
insert_place(text),
insert_card(text, integer, integer);

COMMIT;
