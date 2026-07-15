const client = require('./client');

// Data access for user blocking and user reports (moderation). Enforcement and
// email alerts live in the controllers/services — this file only touches the DB.
module.exports = {
    // Idempotent: blocking someone twice keeps the single original row.
    async createBlock(blockerId, blockedId) {
        const preparedQuery = {
            text: `
            INSERT INTO "user_block" (blocker_id, blocked_id)
            VALUES ($1, $2)
            ON CONFLICT (blocker_id, blocked_id) DO NOTHING
            RETURNING *
            `,
            values: [blockerId, blockedId],
        };
        const result = await client.query(preparedQuery);
        return result.rows[0] ?? null;
    },

    // Only the blocker's own row is removable (directional).
    async deleteBlock(blockerId, blockedId) {
        const preparedQuery = {
            text: `
            DELETE FROM "user_block"
            WHERE blocker_id = $1 AND blocked_id = $2
            `,
            values: [blockerId, blockedId],
        };
        const result = await client.query(preparedQuery);
        return result.rowCount;
    },

    // Symmetric check: a block in either direction stops new messages both ways.
    async isBlockedBetween(explorerA, explorerB) {
        const preparedQuery = {
            text: `
            SELECT 1 FROM "user_block"
            WHERE (blocker_id = $1 AND blocked_id = $2)
               OR (blocker_id = $2 AND blocked_id = $1)
            LIMIT 1
            `,
            values: [explorerA, explorerB],
        };
        const result = await client.query(preparedQuery);
        return result.rowCount > 0;
    },

    // The blocker's own list (with current names) — powers the Block/Unblock UI.
    async getBlocksByExplorer(explorerId) {
        const preparedQuery = {
            text: `
            SELECT ub.blocked_id, e.name AS blocked_name, ub.created_at
            FROM "user_block" ub
            JOIN "explorer" e ON e.id = ub.blocked_id
            WHERE ub.blocker_id = $1
            ORDER BY ub.created_at DESC
            `,
            values: [explorerId],
        };
        const result = await client.query(preparedQuery);
        return result.rows;
    },

    async createReport({ reporterId, reportedId, reportedName, conversationId, reason, comment }) {
        const preparedQuery = {
            text: `
            INSERT INTO "user_report"
                (reporter_id, reported_id, reported_name, conversation_id, reason, comment)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            values: [reporterId, reportedId, reportedName, conversationId, reason, comment],
        };
        const result = await client.query(preparedQuery);
        return result.rows[0];
    },
};
