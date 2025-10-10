const axios = require('axios');

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

function buildQuery(placeName) {
  return `${placeName}`;
}

async function searchOne(placeName) {
  if (!PEXELS_API_KEY) throw new Error('PEXELS_API_KEY missing');

  const query = buildQuery(placeName);
  const url = 'https://api.pexels.com/v1/search';
  const { data } = await axios.get(url, {
    headers: { Authorization: PEXELS_API_KEY },
    params: { query, per_page: 1 },
    timeout: 10_000,
  });

  if (!data || !data.photos || data.photos.length === 0) return null;

  const photo = data.photos[0];
  const src = photo.src || {};
  const imageUrl = src.large2x || src.large || src.original || src.medium;
  const credit = photo.photographer || null;
  const pexelsPageUrl = photo.url || null;

  return { imageUrl, credit, pexelsPageUrl };
}

async function downloadAsBuffer(imageUrl) {
  const res = await axios.get(imageUrl, {
    responseType: 'arraybuffer',
    timeout: 20_000,
  });
  return Buffer.from(res.data);
}

module.exports = { searchOne, downloadAsBuffer };
