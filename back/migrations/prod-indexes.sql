-- Indexes copied from production, where they were created by hand. Run
-- manually (psql or phpPgAdmin). Safe to re-run on prod: IF NOT EXISTS skips
-- the ones already there.
--
-- uniq_explorer_card is required, not just faster: the card upserts in
-- models/datamapper.js use ON CONFLICT (explorer_id, card_id), which errors
-- without it.

BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_explorer_card
    ON public.explorer_has_cards USING btree (explorer_id, card_id);

-- Dashboard conversation lists.
CREATE INDEX IF NOT EXISTS idx_conversation_creator_id
    ON public.conversation USING btree (creator_id);
CREATE INDEX IF NOT EXISTS idx_conversation_recipient_id
    ON public.conversation USING btree (recipient_id);
CREATE INDEX IF NOT EXISTS idx_conversation_status
    ON public.conversation USING btree (status);
CREATE INDEX IF NOT EXISTS idx_conversation_creator_status
    ON public.conversation USING btree (creator_id, status);
CREATE INDEX IF NOT EXISTS idx_conversation_recipient_status
    ON public.conversation USING btree (recipient_id, status);

-- Unread counts and message history.
CREATE INDEX IF NOT EXISTS idx_message_conversation_recipient_read
    ON public.message USING btree (conversation_id, recipient_id, read);
CREATE INDEX IF NOT EXISTS idx_message_unread_by_recipient
    ON public.message USING btree (recipient_id, conversation_id)
    WHERE (read = false);
CREATE INDEX IF NOT EXISTS idx_message_conversation_timestamp
    ON public.message USING btree (conversation_id, "timestamp");

COMMIT;

-- Revert:
-- DROP INDEX IF EXISTS idx_message_conversation_timestamp;
-- DROP INDEX IF EXISTS idx_message_unread_by_recipient;
-- DROP INDEX IF EXISTS idx_message_conversation_recipient_read;
-- DROP INDEX IF EXISTS idx_conversation_recipient_status;
-- DROP INDEX IF EXISTS idx_conversation_creator_status;
-- DROP INDEX IF EXISTS idx_conversation_status;
-- DROP INDEX IF EXISTS idx_conversation_recipient_id;
-- DROP INDEX IF EXISTS idx_conversation_creator_id;
-- uniq_explorer_card is deliberately left out: dropping it breaks card saving.
