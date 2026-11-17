const test = require('node:test');
const assert = require('node:assert');

// Swap the datamapper for a fake before the controller loads it, so the test
// never opens a database connection.
const calls = [];
let markAllResult = 3;
let markAllError = null;
const fakeDatamapper = {
  async markAllCardsOwned(args) {
    calls.push(args);
    if (markAllError) throw markAllError;
    return markAllResult;
  },
};
require.cache[require.resolve('../../../models/datamapper')] = {
  id: 'datamapper',
  filename: require.resolve('../../../models/datamapper'),
  loaded: true,
  exports: fakeDatamapper,
};

const cardController = require('../cards');

const fakeRes = () => {
  const res = { statusCode: null, body: null };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  return res;
};

const reset = () => {
  calls.length = 0;
  markAllResult = 3;
  markAllError = null;
};

test('markAllCards marks every card owned and reports how many were added', async () => {
  reset();
  const res = fakeRes();

  await cardController.markAllCards(
    { params: { explorerId: '12' }, body: { status: 'owned' } },
    res,
    () => assert.fail('next should not be called'),
  );

  assert.deepStrictEqual(calls, [{ explorerId: 12 }]);
  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, { ok: true, added: 3 });
});

test('markAllCards rejects any status other than owned', async () => {
  reset();
  const res = fakeRes();

  await cardController.markAllCards(
    { params: { explorerId: '12' }, body: { status: 'duplicated' } },
    res,
    () => assert.fail('next should not be called'),
  );

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(calls.length, 0);
});

test('markAllCards rejects a non-numeric explorer id', async () => {
  reset();
  const res = fakeRes();

  await cardController.markAllCards(
    { params: { explorerId: 'abc' }, body: { status: 'owned' } },
    res,
    () => assert.fail('next should not be called'),
  );

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(calls.length, 0);
});

test('markAllCards forwards database errors to the error handler', async () => {
  reset();
  markAllError = new Error('db down');
  const res = fakeRes();
  let forwarded = null;

  await cardController.markAllCards(
    { params: { explorerId: '12' }, body: { status: 'owned' } },
    res,
    (err) => {
      forwarded = err;
    },
  );

  assert.strictEqual(forwarded, markAllError);
  assert.strictEqual(res.statusCode, null);
});
