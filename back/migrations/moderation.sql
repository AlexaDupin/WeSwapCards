-- Moderation: user blocking + user reports (App Store / Play Store UGC compliance)
-- Run manually (Supabase SQL editor, psql, or phpPgAdmin). Additive only — no
-- existing table/column is altered, so the web app is unaffected.
--
-- `serial` rather than `GENERATED ALWAYS AS IDENTITY`: production runs
-- PostgreSQL 9.6, which predates identity columns (PG 10+). `serial` is valid on
-- both 9.6 and the PG 15 test database, so one file works everywhere.
--
-- user_block: one directional row per block (blocker → blocked). Enforcement is
-- symmetric (neither side can message the other while a row exists in either
-- direction), but only the blocker can remove their own row. Message history
-- stays readable on both sides — blocking only stops NEW messages.
--
-- user_report: a report snapshot. `reported_name` is copied at report time so
-- the report stays actionable even after the reported account is hard-deleted
-- (account deletion cascades explorer rows away). `status` is the moderation
-- workflow marker: 'open' until handled, then 'actioned' or 'dismissed'
-- (CHECK-constrained so the inbox can't fragment into ad-hoc values).
--
-- Moderation workflow (how reports get handled):
--   1. A report email arrives at MODERATION_EMAIL_TO (services/mailer.js), or
--      check the inbox directly: SELECT * FROM user_report WHERE status = 'open';
--   2. If needed, review the linked conversation's messages in the DB.
--   3. Enforce via the Clerk dashboard: warn, ban (locks sign-in), or delete the
--      user — deletion fires the user.deleted webhook, which hard-deletes all
--      their local data (see account-deletion-cascade.sql).
--   4. Close the report:
--      UPDATE user_report SET status = 'actioned' /* or 'dismissed' */ WHERE id = ...;

BEGIN;

CREATE TABLE IF NOT EXISTS "user_block" (
    "id"         serial PRIMARY KEY,
    "blocker_id" int NOT NULL REFERENCES "explorer"("id") ON DELETE CASCADE,
    "blocked_id" int NOT NULL REFERENCES "explorer"("id") ON DELETE CASCADE,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    UNIQUE ("blocker_id", "blocked_id"),
    CHECK ("blocker_id" <> "blocked_id")
);

-- The UNIQUE constraint already indexes (blocker_id, blocked_id); this covers
-- the reverse direction of the symmetric isBlockedBetween lookup.
CREATE INDEX IF NOT EXISTS "user_block_blocked_idx"
    ON "user_block" ("blocked_id");

CREATE TABLE IF NOT EXISTS "user_report" (
    "id"              serial PRIMARY KEY,
    "reporter_id"     int NOT NULL REFERENCES "explorer"("id") ON DELETE CASCADE,
    "reported_id"     int REFERENCES "explorer"("id") ON DELETE SET NULL,
    "reported_name"   text NOT NULL,
    "conversation_id" int REFERENCES "conversation"("id") ON DELETE SET NULL,
    "reason"          text NOT NULL CHECK ("reason" IN
        ('harassment', 'inappropriate_content', 'spam', 'scam', 'other')),
    "comment"         text CHECK ("comment" IS NULL OR char_length("comment") <= 500),
    "status"          text NOT NULL DEFAULT 'open'
                      CHECK ("status" IN ('open', 'actioned', 'dismissed')),
    "created_at"      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "user_report_reported_idx"
    ON "user_report" ("reported_id");
CREATE INDEX IF NOT EXISTS "user_report_status_idx"
    ON "user_report" ("status");

COMMIT;

-- Revert:
-- DROP TABLE IF EXISTS "user_report";
-- DROP TABLE IF EXISTS "user_block";
