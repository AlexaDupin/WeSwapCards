const test = require('node:test');
const assert = require('node:assert');

const { stripPartnerIds } = require('../partnerImageService');

// The invariant worth protecting: `swap_explorer_userid` is the conversation
// partner's Clerk user id and must never reach a client on any code path.
// Other added columns are backward-compatible and deliberately NOT asserted
// here — both clients receive the same response shape.

const conversationRow = () => ({
  row_id: 1,
  db_id: 42,
  card_name: 'Rome 12',
  swap_explorer: 'someone',
  swap_explorer_id: 7,
  swap_explorer_userid: 'user_2abcDEF',
  status: 'In progress',
  creator_id: 3,
  recipient_id: 7,
  unread: 2,
  last_message_at: '2026-08-01T10:00:00.000Z',
});

test('stripPartnerIds removes the partner Clerk id', () => {
  const rows = [conversationRow()];

  stripPartnerIds(rows);

  assert.ok(!('swap_explorer_userid' in rows[0]));
});

test('stripPartnerIds leaves every other field untouched', () => {
  const rows = [conversationRow()];
  const expected = { ...conversationRow() };
  delete expected.swap_explorer_userid;

  stripPartnerIds(rows);

  assert.deepStrictEqual(rows[0], expected);
});

test('stripPartnerIds handles empty and non-array input without throwing', () => {
  assert.deepStrictEqual(stripPartnerIds([]), []);
  assert.strictEqual(stripPartnerIds(undefined), undefined);
  assert.strictEqual(stripPartnerIds(null), null);
});

test('stripPartnerIds skips null entries inside the array', () => {
  const rows = [null, conversationRow()];

  stripPartnerIds(rows);

  assert.strictEqual(rows[0], null);
  assert.ok(!('swap_explorer_userid' in rows[1]));
});
