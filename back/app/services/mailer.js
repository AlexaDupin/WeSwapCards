const nodemailer = require('nodemailer');

// Moderation email alerts. Same contract as pushNotificationService: fully
// best-effort — it never throws into the caller, so an email failure can never
// affect the report request. Without SMTP env config it degrades to a no-op
// (reports still land in the DB; the inbox is the user_report table).
//
// Env: SMTP_HOST, SMTP_PORT, SMTP_SECURE ('true' for implicit TLS/465),
//      SMTP_USER, SMTP_PASS, SMTP_FROM, MODERATION_EMAIL_TO.

let transporter = null;
let warnedMissingConfig = false;

function getTransporter() {
    if (transporter) return transporter;
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        if (!warnedMissingConfig) {
            console.warn('[mailer] SMTP env not configured — moderation emails disabled');
            warnedMissingConfig = true;
        }
        return null;
    }
    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    return transporter;
}

/**
 * Alert the moderation inbox that a new user report was filed.
 *
 * Plain-text on purpose: no HTML rendering means user-provided text (the
 * comment) needs no output encoding, and it reads fine in any client. The
 * body carries only the report fields — never chat-message excerpts.
 *
 * @param {{ id: number, reporterId: number, reporterName: string|null,
 *           reportedId: number, reportedName: string, conversationId: number|null,
 *           reason: string, comment: string|null }} report
 */
async function sendReportNotification(report) {
    try {
        const transport = getTransporter();
        if (!transport) return;

        const to = process.env.MODERATION_EMAIL_TO || 'contact@weswapcards.com';
        const lines = [
            `A new user report was filed (report #${report.id}).`,
            '',
            `Reporter:     ${report.reporterName ?? 'unknown'} (explorer ${report.reporterId})`,
            `Reported:     ${report.reportedName} (explorer ${report.reportedId})`,
            `Conversation: ${report.conversationId ?? 'n/a'}`,
            `Reason:       ${report.reason}`,
            `Comment:      ${report.comment || '(none)'}`,
            '',
            `Review it in the user_report table (status: open).`,
        ];

        await transport.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to,
            subject: `[WeSwapCards] New user report #${report.id} (${report.reason})`,
            text: lines.join('\n'),
        });
    } catch (err) {
        // Swallow — delivery is best-effort and must never break the report.
        console.error('[mailer] sendReportNotification failed:', err?.message || err);
    }
}

module.exports = { sendReportNotification };
