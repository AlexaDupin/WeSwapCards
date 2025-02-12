-- Revert wecards:new-place-rome from pg

BEGIN;

DELETE FROM place
WHERE name = 'Rome';

COMMIT;
