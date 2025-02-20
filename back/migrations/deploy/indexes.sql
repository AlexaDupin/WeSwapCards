-- Deploy wecards:indexes to pg

BEGIN;

CREATE INDEX card_name ON card USING HASH(name);
CREATE INDEX card_number ON card USING HASH(number);
CREATE INDEX place_name ON place USING HASH(name);
CREATE INDEX ehc_duplicate ON explorer_has_cards USING HASH(duplicate);
CREATE INDEX explorer_name ON explorer USING HASH(name);

COMMIT;
