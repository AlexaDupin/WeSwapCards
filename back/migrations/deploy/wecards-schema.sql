-- Deploy wecards:wecards-schema to pg

BEGIN;

CREATE TABLE "explorer" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL UNIQUE
);

CREATE TABLE "place" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL UNIQUE
);

CREATE TABLE "card" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text UNIQUE,
    "number" int NOT NULL,
    "place_id" int REFERENCES "place"(id)
);

CREATE TABLE "explorer_has_cards" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "explorer_id" int NOT NULL REFERENCES "explorer"(id),
  "card_id" int NOT NULL REFERENCES "card" ("id"),
  "duplicate" boolean NOT NULL DEFAULT false
);

-- Add conversation and message tables
-- Add ON DELETE action and ON UPDATE action for FK
-- Add indexes on most used columns

-- Created a unique constraint on username 
----CREATE UNIQUE INDEX unique_name_casesensitivity
----ON "explorer" (lower(name));


COMMIT;
