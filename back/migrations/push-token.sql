-- Push notifications: device push-token storage
-- Run manually (Supabase SQL editor, psql, or phpPgAdmin). Additive only — no
-- existing table/column is altered, so the web app is unaffected.
--
-- `serial` rather than `GENERATED ALWAYS AS IDENTITY`: production runs
-- PostgreSQL 9.6, which predates identity columns (PG 10+). `serial` is valid on
-- both 9.6 and the PG 15 test database, so one file works everywhere.
--
-- One row per device token. A device that reinstalls/rotates re-registers the
-- same `token` (ON CONFLICT upsert). Multiple active rows per explorer = multiple
-- devices. `disabled_at` is set on logout/opt-out or when Expo reports the token
-- as no longer registered (DeviceNotRegistered).

BEGIN;

CREATE TABLE IF NOT EXISTS "push_token" (
    "id"          serial PRIMARY KEY,
    "explorer_id" int  NOT NULL REFERENCES "explorer"("id") ON DELETE CASCADE,
    "token"       text NOT NULL UNIQUE,
    "platform"    text NOT NULL,
    "created_at"  timestamptz NOT NULL DEFAULT now(),
    "updated_at"  timestamptz NOT NULL DEFAULT now(),
    "disabled_at" timestamptz
);

-- Fast lookup of a recipient's currently-active tokens when sending a push.
CREATE INDEX IF NOT EXISTS "push_token_explorer_active_idx"
    ON "push_token" ("explorer_id")
    WHERE "disabled_at" IS NULL;

COMMIT;

-- Revert:
-- DROP TABLE IF EXISTS "push_token";
