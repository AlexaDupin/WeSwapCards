require('dotenv').config();
const pool = require('../models/client');
const { ingestForPlaceId } = require('../services/imageIngestionService');

(async () => {
  const id = parseInt(process.argv[2], 10);
  const force = process.argv.includes('--force');

  const queryArg = process.argv.find(arg => arg.startsWith('--query='));
  const customQuery = queryArg ? queryArg.replace('--query=', '').replace(/^"|"$/g, '') : null;

  if (!Number.isInteger(id)) {
    console.error('Usage: node scripts/refreshPlaceImage.js <placeId> [--force] [--query="custom search"]');
    process.exit(1);
  }
  try {
    const res = await ingestForPlaceId(id, { force, customQuery });
    console.log('Result:', res);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await pool.end();
  }
})();
