-- Deploy wecards:new-place-rome to pg

BEGIN;

INSERT INTO "place" ("name") VALUES
('Rome');

COMMIT;
