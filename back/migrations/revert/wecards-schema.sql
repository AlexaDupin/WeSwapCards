-- Revert wecards:wecards-schema from pg

BEGIN;

DROP TABLE "explorer_has_cards", "card", "place", "explorer";

COMMIT;
