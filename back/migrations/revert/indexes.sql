-- Revert wecards:indexes from pg

BEGIN;

DROP INDEX card_name;
DROP INDEX card_number;
DROP INDEX place_name;
DROP INDEX duplicate;

COMMIT;
