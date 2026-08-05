const moderationDatamapper = require('../../models/moderation');
const userDatamapper = require('../../models/user');
const { sendReportNotification } = require('../../services/mailer');

// Reasons a user can pick in the report UI. Kept in sync with the DB CHECK
// constraint on user_report.reason and the mobile reportReasons list.
const REPORT_REASONS = ['harassment', 'inappropriate_content', 'spam', 'scam', 'other'];
const COMMENT_MAX_LENGTH = 500;

// Trust-and-safety endpoints: block/unblock/list-blocks + report. The acting
// user is always req.params.explorerId, verified against the Clerk session by
// checkExplorerAuthorization before these handlers run.
const moderationController = {
    async blockUser(req, res) {
        const explorerId = Number(req.params.explorerId);
        const targetExplorerId = Number(req.params.targetExplorerId);

        if (!Number.isInteger(targetExplorerId) || targetExplorerId <= 0) {
            return res.status(400).json({ error: 'Invalid target user.' });
        }
        if (targetExplorerId === explorerId) {
            return res.status(400).json({ error: 'You cannot block yourself.' });
        }

        try {
            await moderationDatamapper.createBlock(explorerId, targetExplorerId);
            // Idempotent: an already-existing block also reports success.
            return res.status(201).json({ blocked_id: targetExplorerId });
        } catch (error) {
            if (error.code === '23503') {
                return res.status(404).json({ error: 'User not found.' });
            }
            console.error('Error while blocking user:', error);
            return res.status(500).json({ error: 'An error occurred while blocking this user.' });
        }
    },

    async unblockUser(req, res) {
        const explorerId = Number(req.params.explorerId);
        const targetExplorerId = Number(req.params.targetExplorerId);

        try {
            // Only the blocker's own directional row can be removed; a user can
            // never lift a block someone else placed on them.
            const removed = await moderationDatamapper.deleteBlock(explorerId, targetExplorerId);
            return res.status(200).json({ removed });
        } catch (error) {
            console.error('Error while unblocking user:', error);
            return res.status(500).json({ error: 'An error occurred while unblocking this user.' });
        }
    },

    async getMyBlocks(req, res) {
        const explorerId = Number(req.params.explorerId);

        try {
            const blocks = await moderationDatamapper.getBlocksByExplorer(explorerId);
            return res.status(200).json(blocks);
        } catch (error) {
            console.error('Error while retrieving blocks:', error);
            return res.status(500).json({ error: 'An error occurred while retrieving your blocked users.' });
        }
    },

    async reportUser(req, res) {
        const reporterId = Number(req.params.explorerId);
        const { reported_explorer_id: reportedIdRaw, conversation_id: conversationIdRaw, reason } = req.body;

        const reportedId = Number(reportedIdRaw);
        if (!Number.isInteger(reportedId) || reportedId <= 0) {
            return res.status(400).json({ error: 'Invalid reported user.' });
        }
        if (!REPORT_REASONS.includes(reason)) {
            return res.status(400).json({ error: 'Invalid report reason.' });
        }

        // Optional free-text comment: trimmed and length-checked, but stored
        // verbatim through the parameterized query — no pre-escaping. Output
        // contexts encode for themselves (the alert email is plain text).
        let comment = null;
        if (req.body.comment != null) {
            if (typeof req.body.comment !== 'string') {
                return res.status(400).json({ error: 'Invalid comment.' });
            }
            comment = req.body.comment.trim();
            if (comment.length > COMMENT_MAX_LENGTH) {
                return res.status(400).json({ error: `Comment must be ${COMMENT_MAX_LENGTH} characters or fewer.` });
            }
            if (comment.length === 0) comment = null;
        }

        // Optional conversation link (SET NULL on conversation deletion).
        let conversationId = null;
        if (conversationIdRaw != null) {
            conversationId = Number(conversationIdRaw);
            if (!Number.isInteger(conversationId) || conversationId <= 0) {
                return res.status(400).json({ error: 'Invalid conversation.' });
            }
        }

        try {
            // Snapshot the reported user's current name so the report stays
            // actionable after an account hard-delete.
            const reportedName = await userDatamapper.getExplorerNameById(reportedId);
            if (reportedName === null) {
                return res.status(404).json({ error: 'User not found.' });
            }

            const report = await moderationDatamapper.createReport({
                reporterId,
                reportedId,
                reportedName,
                conversationId,
                reason,
                comment,
            });

            // Respond first so report submission never waits on (or fails with)
            // email delivery — same pattern as push notifications on new messages.
            res.status(201).json({ id: report.id, status: report.status });

            userDatamapper
                .getExplorerNameById(reporterId)
                .catch(() => null)
                .then((reporterName) =>
                    sendReportNotification({
                        id: report.id,
                        reporterId,
                        reporterName,
                        reportedId,
                        reportedName,
                        conversationId,
                        reason,
                        comment,
                    }),
                )
                .catch((err) =>
                    console.error('[mailer] report notification failed:', err?.message || err),
                );

            return;
        } catch (error) {
            console.error('Error while creating report:', error);
            return res.status(500).json({ error: 'An error occurred while sending your report.' });
        }
    },
};

module.exports = moderationController;
