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
      const res = await ingestForPlaceId(placeId);
      if (!res?.ok) {
        console.warn(`[LISTEN] not-ok place_id=${placeId} -> ${res?.reason || 'unknown'}`);
      }    
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

  let okCount = 0, failCount = 0, skipped = 0;

  for (const row of r.rows) {
    try {
      const res = await ingestForPlaceId(row.id);
      if (res?.ok) {
        okCount++;
      } else if (res?.reason && ['no_results', 'already_has_image', 'rate_limited'].includes(res.reason)) {
        skipped++;
      } else {
        failCount++;
        console.warn(`[SWEEP] not-ok place_id=${row.id} -> ${res?.reason || 'unknown'}`);
      }
    } catch (e) {
      failCount++;
      console.error(`[SWEEP] Error place_id=${row.id}`, e.message);
    }
  }

  console.log(`[SWEEP] summary batch=${BATCH} -> ok=${okCount}, skipped=${skipped}, failed=${failCount}`);
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
      console.error('[WORKER] LISTEN failed, continuing without it', e.message);
    }
  }
  if (SWEEP_EVERY_SEC > 0) {
    await startSweeper();
  }
})();
