const client = require('./client');

// Data access for device push tokens. No push-sending logic lives here — the
// service layer (services/pushNotificationService.js) owns delivery.
module.exports = {
    // Insert or re-activate a device token. Keyed on the unique `token`, so the
    // same device reinstalling/rotating updates its single row (and is moved to
    // the current explorer + re-enabled).
    async upsertPushToken({ explorerId, token, platform }) {
        const preparedQuery = {
            text: `
            INSERT INTO "push_token" (explorer_id, token, platform)
            VALUES ($1, $2, $3)
            ON CONFLICT (token) DO UPDATE
            SET explorer_id = EXCLUDED.explorer_id,
                platform    = EXCLUDED.platform,
                updated_at  = now(),
                disabled_at = NULL
            RETURNING *
            `,
            values: [explorerId, token, platform],
        };
        const result = await client.query(preparedQuery);
        return result.rows[0];
    },

    // Active (non-disabled) tokens for a recipient, used when sending a push.
    async getActivePushTokensForExplorer(explorerId) {
        const preparedQuery = {
            text: `
            SELECT token, platform
            FROM "push_token"
            WHERE explorer_id = $1 AND disabled_at IS NULL
            `,
            values: [explorerId],
        };
        const result = await client.query(preparedQuery);
        return result.rows;
    },

    // Soft-disable a token (logout / opt-out / DeviceNotRegistered cleanup).
    // When `explorerId` is provided the disable is scoped to that owner, so a
    // user can only disable their own device token (the public DELETE endpoint
    // passes it; the internal cleanup path omits it).
    async disablePushToken(token, explorerId = null) {
        const preparedQuery = {
            text: `
            UPDATE "push_token"
            SET disabled_at = now()
            WHERE token = $1
              AND disabled_at IS NULL
              AND ($2::int IS NULL OR explorer_id = $2)
            `,
            values: [token, explorerId],
        };
        const result = await client.query(preparedQuery);
        return result.rowCount;
    },
};
