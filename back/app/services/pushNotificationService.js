const { Expo } = require('expo-server-sdk');
const pushTokenDatamapper = require('../models/pushToken');
const userDatamapper = require('../models/user');

// Single Expo client for the process. (Reads EXPO_ACCESS_TOKEN from env if set,
// which is recommended once you enable enhanced push security in Expo.)
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

/**
 * Notify a recipient that they have a new chat message.
 *
 * Best-effort and fully self-contained: it never throws into the caller, so a
 * push failure can never affect the message-send request (web or mobile).
 *
 * v1 content is intentionally minimal for privacy + store-review safety:
 * the body does NOT include the message text.
 *
 * Token lookup happens first; if the recipient has no active devices (e.g. a
 * web-only user), it returns before any further work — so the shared message
 * endpoint does just one indexed query in that common case.
 *
 * @param {{ recipientId: number, senderId: number, conversationId: number }} args
 */
async function sendNewMessageNotification({ recipientId, senderId, conversationId }) {
    try {
        const rows = await pushTokenDatamapper.getActivePushTokensForExplorer(recipientId);
        if (!rows.length) return;

        // Keep only valid Expo tokens.
        const tokens = rows
            .map((r) => r.token)
            .filter((t) => Expo.isExpoPushToken(t));
        if (!tokens.length) return;

        // Only now (we know there's someone to notify) resolve the sender name.
        const senderName = await userDatamapper.getExplorerNameById(senderId);

        const messages = tokens.map((token) => ({
            to: token,
            sound: 'default',
            title: senderName || 'New message',
            body: 'You have a new message',
            data: { conversationId },
        }));

        // Expo requires batching; chunks preserve message order so a ticket at
        // index i corresponds to the message (and token) at index i.
        const chunks = expo.chunkPushNotificationsAsync
            ? await expo.chunkPushNotificationsAsync(messages)
            : expo.chunkPushNotifications(messages);

        let offset = 0;
        for (const chunk of chunks) {
            try {
                const tickets = await expo.sendPushNotificationsAsync(chunk);
                await handleTickets(tickets, tokens, offset);
            } catch (err) {
                // One chunk failing must not abort the others.
                console.error('[push] chunk send failed:', err?.message || err);
            }
            offset += chunk.length;
        }
    } catch (err) {
        // Swallow — delivery is best-effort and must never break message send.
        console.error('[push] sendNewMessageNotification failed:', err?.message || err);
    }
}

// Disable tokens Expo reports as no longer registered so we stop sending to
// dead devices. Tickets line up positionally with the tokens slice they came from.
async function handleTickets(tickets, tokens, offset) {
    await Promise.all(
        tickets.map(async (ticket, i) => {
            if (ticket.status !== 'error') return;
            if (ticket.details?.error === 'DeviceNotRegistered') {
                const token = tokens[offset + i];
                if (token) {
                    try {
                        await pushTokenDatamapper.disablePushToken(token);
                    } catch (err) {
                        console.error('[push] failed to disable token:', err?.message || err);
                    }
                }
            }
        }),
    );
}

module.exports = { sendNewMessageNotification };
