require('dotenv').config();
const pool = require('../models/client');
const { Client } = require('pg');
const { ingestForPlaceId } = require('../services/imageIngestionService');

const USE_LISTEN = String(process.env.WORKER_USE_LISTEN || 'true') === 'true';
const SWEEP_EVERY_SEC = parseInt(process.env.WORKER_SWEEP_INTERVAL_SEC || '0', 10);
const BATCH = parseInt(process.env.WORKER_BATCH_SIZE || '5', 10);

async function startListen() {
  const client = new Client({ connectionString: process.env.PG_URL });
  await client.connect();

  client.on('error', (e) => console.error('[LISTEN] client error', e));
  await client.query('LISTEN image_ingest');
  console.log('[LISTEN] Listening on channel image_ingest');

  client.on('notification', async (msg) => {
    const placeId = parseInt(msg.payload, 10);
    if (!Number.isInteger(placeId)) return;

    try {
      console.log(`[LISTEN] Received place_id=${placeId}`);
      const res = await ingestForPlaceId(placeId);
      console.log(`[LISTEN] place_id=${placeId} ->`, res);
    } catch (e) {
      console.error(`[LISTEN] Error processing place_id=${placeId}`, e);
    }
  });
}

async function sweepOnce() {
  const sql = `
    SELECT id
    FROM "place"
    WHERE image_url IS NULL
    ORDER BY created_at DESC
    LIMIT $1
  `;
  const r = await pool.query(sql, [BATCH]);

  for (const row of r.rows) {
    try {
      console.log(`[SWEEP] Processing place_id=${row.id}`);
      const res = await ingestForPlaceId(row.id);
      console.log(`[SWEEP] place_id=${row.id} ->`, res);
    } catch (e) {
      console.error(`[SWEEP] Error place_id=${row.id}`, e);
    }
  }
}

async function startSweeper() {
  console.log(`[SWEEP] Interval ${SWEEP_EVERY_SEC}s, batch=${BATCH}`);
  await sweepOnce();
  setInterval(sweepOnce, SWEEP_EVERY_SEC * 1000);
}

(async () => {
  console.log('[WORKER] Starting...');
  if (USE_LISTEN) {
    try {
      await startListen();
    } catch (e) {
      console.error('[WORKER] LISTEN failed, continuing without it', e);
    }
  }
  if (SWEEP_EVERY_SEC > 0) {
    await startSweeper();
  }
})();
