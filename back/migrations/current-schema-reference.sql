-- Reference schema (NOT a migration to run) — documents the real production
-- structure for tables/columns added outside the tracked deploy/ migrations,
-- so the repo reflects reality. Captured from prod pg_dump + introspection.
-- FK on-delete actions reflect state AFTER account-deletion-cascade.sql.

-- explorer: `userid` (Clerk user id, unique) and `last_active_at` were added
-- after the original wecards-schema.sql.
-- CREATE TABLE explorer (
--   id            int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--   name          text NOT NULL UNIQUE,
--   userid        text UNIQUE,              -- Clerk user id
--   last_active_at timestamp
-- );

-- conversation (one row per swap chat between two explorers)
-- CREATE TABLE conversation (
--   id           int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--   status       text DEFAULT 'In progress',
--   card_name    text REFERENCES card(name) ON UPDATE CASCADE ON DELETE CASCADE,
--   creator_id   int  REFERENCES explorer(id) ON UPDATE CASCADE ON DELETE CASCADE,
--   recipient_id int  REFERENCES explorer(id) ON UPDATE CASCADE ON DELETE CASCADE,
--   "timestamp"  timestamptz
-- );

-- message
-- CREATE TABLE message (
--   id              int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--   content         text,
--   "timestamp"     timestamptz,
--   read            boolean DEFAULT false,
--   sender_id       int REFERENCES explorer(id) ON UPDATE CASCADE ON DELETE CASCADE,
--   recipient_id    int REFERENCES explorer(id) ON UPDATE CASCADE ON DELETE CASCADE,
--   conversation_id int REFERENCES conversation(id) ON UPDATE CASCADE ON DELETE CASCADE
-- );

-- push_token: see migrations/push-token.sql (explorer_id ON DELETE CASCADE).

-- user_block / user_report: see migrations/moderation.sql.
-- user_block  — directional block rows (blocker_id, blocked_id → explorer,
--               both ON DELETE CASCADE; UNIQUE pair; blocker <> blocked).
-- user_report — report snapshots (reporter_id CASCADE, reported_id SET NULL,
--               reported_name text snapshot survives account hard-delete,
--               conversation_id SET NULL, reason CHECK whitelist, comment ≤500
--               CHECK, status CHECK 'open'/'actioned'/'dismissed').

-- Net effect for account deletion: DELETE FROM explorer WHERE id = $1 cascades to
-- explorer_has_cards, push_token, conversation (as creator or recipient), and
-- message (as sender, recipient, or via its conversation).
