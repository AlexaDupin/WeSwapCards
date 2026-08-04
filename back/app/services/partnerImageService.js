const { clerkClient } = require('@clerk/express');

// Resolves conversation-partner avatars from Clerk and attaches them to the
// dashboard/conversation rows returned to the mobile app.
//
// Partner photos are NOT stored in our DB (the `explorer` table has no image
// column); they live in Clerk, keyed by `explorer.userid`. The conversation
// queries surface that Clerk id as `swap_explorer_userid`; here we turn it into
// a `swap_explorer_image` URL (or null) and strip the internal id before the
// object leaves the API.
//
// Best-effort by design: a Clerk hiccup must never 500 the conversation list.

// Clerk Backend API is rate-limited, so we cache resolved images (including
// "no image" as null) instead of hitting Clerk on every dashboard load.
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CACHE_MAX_ENTRIES = 2000;
// Clerk's getUserList `userId` filter accepts at most 100 ids per call.
const CLERK_ID_CHUNK = 100;

// Map<clerkUserId, { url: string | null, expiresAt: number }>
const imageCache = new Map();

function now() {
  return Date.now();
}

function getCached(userid) {
  const entry = imageCache.get(userid);
  if (!entry) return undefined; // unknown
  if (entry.expiresAt <= now()) {
    imageCache.delete(userid);
    return undefined; // expired
  }
  return entry; // { url }
}

function setCached(userid, url) {
  // Bound the cache: drop the oldest insertion (Map preserves insertion order)
  // once we're at capacity so it can't grow without limit.
  if (!imageCache.has(userid) && imageCache.size >= CACHE_MAX_ENTRIES) {
    const oldest = imageCache.keys().next().value;
    if (oldest !== undefined) imageCache.delete(oldest);
  }
  imageCache.set(userid, { url, expiresAt: now() + CACHE_TTL_MS });
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Attach `swap_explorer_image` to each conversation and remove the internal
 * `swap_explorer_userid`. Mutates and returns the same array.
 *
 * @param {Array<object>} conversations rows carrying `swap_explorer_userid`
 * @returns {Promise<Array<object>>}
 */
async function attachPartnerImages(conversations) {
  if (!Array.isArray(conversations) || conversations.length === 0) {
    return conversations;
  }

  // Distinct, non-empty partner Clerk ids across the page.
  const ids = [
    ...new Set(
      conversations
        .map((c) => c && c.swap_explorer_userid)
        .filter((id) => typeof id === 'string' && id.length > 0),
    ),
  ];

  // Resolved image per Clerk id for THIS response (url or null).
  const resolved = new Map();
  const misses = [];
  for (const id of ids) {
    const cached = getCached(id);
    if (cached) resolved.set(id, cached.url);
    else misses.push(id);
  }

  for (const idChunk of chunk(misses, CLERK_ID_CHUNK)) {
    try {
      const { data: users } = await clerkClient.users.getUserList({
        userId: idChunk,
        // Without an explicit limit Clerk defaults to 10 and would truncate a
        // full chunk. Never below 1.
        limit: Math.max(1, idChunk.length),
      });

      const seen = new Set();
      for (const user of users || []) {
        // Clerk's `imageUrl` always returns a generated default; only surface
        // an avatar the user actually supplied.
        const url = user.hasImage ? user.imageUrl : null;
        resolved.set(user.id, url);
        setCached(user.id, url);
        seen.add(user.id);
      }
      // Ids the successful call did not return are genuinely missing (deleted
      // user / bad id) — cache that as null so we don't refetch every load.
      for (const id of idChunk) {
        if (!seen.has(id)) {
          resolved.set(id, null);
          setCached(id, null);
        }
      }
    } catch (error) {
      // Transient failure: resolve to null for THIS response only. Do not
      // cache, so a later request can retry.
      console.error('partnerImageService: Clerk lookup failed:', error.message);
      for (const id of idChunk) {
        if (!resolved.has(id)) resolved.set(id, null);
      }
    }
  }

  for (const conv of conversations) {
    if (!conv || typeof conv !== 'object') continue;
    const id = conv.swap_explorer_userid;
    conv.swap_explorer_image = resolved.has(id) ? resolved.get(id) : null;
    delete conv.swap_explorer_userid;
  }

  return conversations;
}

/**
 * Remove the internal partner Clerk id without resolving anything.
 *
 * `swap_explorer_userid` is the conversation partner's Clerk user id — a join
 * artifact the query surfaces only so avatars can be looked up. It is a third
 * party's auth identifier and must never reach any client, web or mobile.
 * attachPartnerImages already deletes it once it has resolved the avatar; this
 * does the same on the paths that skip the Clerk lookup entirely.
 *
 * Everything else in the row is left alone: added columns are backward-
 * compatible and both clients receive the same response shape.
 *
 * Mutates and returns the same array.
 *
 * @param {Array<object>} conversations
 * @returns {Array<object>}
 */
function stripPartnerIds(conversations) {
  if (!Array.isArray(conversations)) {
    return conversations;
  }

  for (const conv of conversations) {
    if (!conv || typeof conv !== 'object') continue;
    delete conv.swap_explorer_userid;
  }

  return conversations;
}

module.exports = { attachPartnerImages, stripPartnerIds };
