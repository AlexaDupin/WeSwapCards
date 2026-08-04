// Mirrors the mobile helper at
// WeSwapCards-native/mobile/src/features/chat/data/sendErrorMessages.ts so both
// clients say exactly the same thing when a block stops a message. Web's other
// error wording is deliberately left as it was.
const BLOCKED_SEND_ERROR = "You can't exchange messages with this collector.";

// axios exposes the HTTP status on error.response.status; error.status only
// exists in newer 1.x releases, so read both and let either answer.
export const getErrorStatus = (err) => err?.response?.status ?? err?.status;

// Returns the blocked copy when the failure is a moderation block, else null.
// The backend sends { code: 'user_blocked' } with a 403 from both the
// create-conversation and the send-message paths.
export const getBlockedSendMessage = (err) =>
  getErrorStatus(err) === 403 && err?.response?.data?.code === 'user_blocked'
    ? BLOCKED_SEND_ERROR
    : null;

// A 4xx is a permanent answer: retrying a block, or a malformed body, only adds
// latency before the user sees the error. 408 and 429 are the exceptions that
// genuinely may succeed on a second attempt. A missing status means the request
// never reached the server (network drop, cold start), which is what the retry
// loop exists for.
export const shouldRetryRequest = (err) => {
  const status = getErrorStatus(err);
  if (typeof status !== 'number') return true;
  if (status === 408 || status === 429) return true;
  return status < 400 || status >= 500;
};
