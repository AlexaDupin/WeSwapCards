-- Completed-swap counter, used as a public trust metric.
-- Run manually (psql or phpPgAdmin). Additive only.
--
-- Deliberately NO foreign key on conversation_id: account deletion cascades the
-- conversation away, and these rows must survive it. A swap that happened stays
-- counted even after the participants leave.
--
-- The table mirrors current status rather than "was ever completed": the app
-- inserts on a move to Completed and deletes on a move away, so a conversation
-- reopened and re-declined stops counting. Both operations are idempotent.
--
-- Ownership: this table must end up owned by polo2734_weswapcards, the group
-- role that both the API user and the phpPgAdmin user belong to. Owned by
-- either individual instead, it is invisible to the other with `permission
-- denied`, while every catalog check still passes.
--   ALTER TABLE swap_completed OWNER TO polo2734_weswapcards;

BEGIN;

CREATE TABLE IF NOT EXISTS "swap_completed" (
    "conversation_id" int PRIMARY KEY,
    "completed_at"    timestamptz NOT NULL DEFAULT now(),
    "card_name"       text
);

COMMIT;

-- Backfill, one time. `completed_at` for historical rows is the conversation's
-- creation timestamp, since completion time was never recorded.

-- Live conversations currently marked Completed.
INSERT INTO "swap_completed" ("conversation_id", "card_name", "completed_at")
SELECT id, card_name, COALESCE("timestamp", now())
FROM "conversation"
WHERE status = 'Completed'
ON CONFLICT ("conversation_id") DO NOTHING;

-- Conversations that were Completed when their owner's account was deleted.
-- Sourced from the pre-cleanup snapshot; only valid while that table exists.
INSERT INTO "swap_completed" ("conversation_id", "card_name", "completed_at")
SELECT b.id, b.card_name, COALESCE(b."timestamp", now())
FROM "conversation_backup_20260805" b
WHERE b.status = 'Completed'
  AND NOT EXISTS (SELECT 1 FROM "conversation" c WHERE c.id = b.id)
ON CONFLICT ("conversation_id") DO NOTHING;

-- Revert:
-- DROP TABLE IF EXISTS "swap_completed";
