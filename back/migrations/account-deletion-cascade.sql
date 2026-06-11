-- Account deletion: enforce ON DELETE CASCADE for explorer-owned data.
-- Run manually (Supabase SQL editor or psql). Apply to the TEST db first,
-- verify, then production. Take a fresh pg_dump backup before running on prod.
--
-- Why: in-app account deletion (Apple/Play requirement) deletes the `explorer`
-- row; the DB must cascade-remove all of that user's personal data. Today the
-- conversation/message participant FKs are ON DELETE SET NULL (rows survive,
-- anonymized). We switch them to CASCADE so a single `DELETE FROM explorer`
-- hard-deletes the user's conversations and messages. explorer_has_cards and
-- push_token already cascade. This changes web deletion to hard-delete too —
-- the intended, consistent policy.
--
-- Effect: deleting a user removes the conversations they took part in, including
-- the other participant's messages in those conversations. The other user and
-- their unrelated data are untouched.

BEGIN;

-- conversation participants: SET NULL -> CASCADE
ALTER TABLE "conversation" DROP CONSTRAINT "conversation_creator_id_fkey";
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_creator_id_fkey"
    FOREIGN KEY ("creator_id") REFERENCES "explorer"("id")
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "conversation" DROP CONSTRAINT "conversation_recipient_id_fkey";
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_recipient_id_fkey"
    FOREIGN KEY ("recipient_id") REFERENCES "explorer"("id")
    ON UPDATE CASCADE ON DELETE CASCADE;

-- message participants: SET NULL -> CASCADE (uniform policy; messages die with
-- their participants as well as with their conversation)
ALTER TABLE "message" DROP CONSTRAINT "message_sender_id_fkey";
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_fkey"
    FOREIGN KEY ("sender_id") REFERENCES "explorer"("id")
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "message" DROP CONSTRAINT "message_recipient_id_fkey";
ALTER TABLE "message" ADD CONSTRAINT "message_recipient_id_fkey"
    FOREIGN KEY ("recipient_id") REFERENCES "explorer"("id")
    ON UPDATE CASCADE ON DELETE CASCADE;

-- message -> conversation is expected to already be CASCADE; re-assert it so the
-- "delete conversation also deletes its messages" safety net is guaranteed
-- regardless of starting state / cascade ordering.
ALTER TABLE "message" DROP CONSTRAINT "message_conversation_id_fkey";
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_id_fkey"
    FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id")
    ON UPDATE CASCADE ON DELETE CASCADE;

COMMIT;

-- Revert (restore the previous SET NULL behavior for participant FKs):
-- BEGIN;
-- ALTER TABLE "conversation" DROP CONSTRAINT "conversation_creator_id_fkey";
-- ALTER TABLE "conversation" ADD CONSTRAINT "conversation_creator_id_fkey"
--     FOREIGN KEY ("creator_id") REFERENCES "explorer"("id")
--     ON UPDATE CASCADE ON DELETE SET NULL;
-- ALTER TABLE "conversation" DROP CONSTRAINT "conversation_recipient_id_fkey";
-- ALTER TABLE "conversation" ADD CONSTRAINT "conversation_recipient_id_fkey"
--     FOREIGN KEY ("recipient_id") REFERENCES "explorer"("id")
--     ON UPDATE CASCADE ON DELETE SET NULL;
-- ALTER TABLE "message" DROP CONSTRAINT "message_sender_id_fkey";
-- ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_fkey"
--     FOREIGN KEY ("sender_id") REFERENCES "explorer"("id")
--     ON UPDATE CASCADE ON DELETE SET NULL;
-- ALTER TABLE "message" DROP CONSTRAINT "message_recipient_id_fkey";
-- ALTER TABLE "message" ADD CONSTRAINT "message_recipient_id_fkey"
--     FOREIGN KEY ("recipient_id") REFERENCES "explorer"("id")
--     ON UPDATE CASCADE ON DELETE SET NULL;
-- COMMIT;
