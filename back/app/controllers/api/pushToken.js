const { Expo } = require('expo-server-sdk');
const pushTokenDatamapper = require('../../models/pushToken');
const userDatamapper = require('../../models/user');

const VALID_PLATFORMS = ['ios', 'android'];

// Resolve the authenticated explorer from the Clerk session. The client is
// never trusted to assert who it is — we always map req.auth.userId → explorer.
async function resolveExplorer(req, res) {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
        res.status(401).json({ message: 'Unauthorized' });
        return null;
    }
    const explorer = await userDatamapper.getExplorerIdByClerkId(clerkUserId);
    if (!explorer) {
        res.status(401).json({ message: 'User not found' });
        return null;
    }
    return explorer; // { id }
}

const pushTokenController = {
    // POST /push-tokens  body: { token, platform, explorerId? }
    async registerPushToken(req, res) {
        const explorer = await resolveExplorer(req, res);
        if (!explorer) return;

        const { token, platform, explorerId } = req.body;

        // If the client sends an explorerId, it must match the authenticated
        // explorer — it is verified, never used as the source of truth.
        if (explorerId != null && Number(explorerId) !== Number(explorer.id)) {
            return res.status(403).json({ message: 'explorerId does not match authenticated user' });
        }

        if (!token || !Expo.isExpoPushToken(token)) {
            return res.status(400).json({ message: 'A valid Expo push token is required' });
        }
        if (!VALID_PLATFORMS.includes(platform)) {
            return res.status(400).json({ message: "platform must be 'ios' or 'android'" });
        }

        await pushTokenDatamapper.upsertPushToken({
            explorerId: explorer.id,
            token,
            platform,
        });

        return res.status(200).json({ message: 'Push token registered' });
    },

    // DELETE /push-tokens  body: { token }
    async deletePushToken(req, res) {
        const explorer = await resolveExplorer(req, res);
        if (!explorer) return;

        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'token is required' });
        }

        // Scoped to the owner so a user can only disable their own device token.
        await pushTokenDatamapper.disablePushToken(token, explorer.id);

        return res.status(200).json({ message: 'Push token disabled' });
    },
};

module.exports = pushTokenController;
