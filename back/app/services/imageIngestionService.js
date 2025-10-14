const pool = require('../models/client');
const { searchOne, downloadAsBuffer } = require('./pexels');
const { uploadBuffer, destroyByPublicId, slugify } = require('./cloudinary');

async function getPlace(id) {
  const res = await pool.query('SELECT id, name, image_url FROM "place" WHERE id = $1', [id]);
  return res.rows[0] || null;
}

async function setImageFields(id, { imageUrl, image_origin_url, image_credit }) {
  await pool.query(
    `UPDATE "place"
     SET image_url = $1, image_origin_url = $2, image_credit = $3
     WHERE id = $4`,
    [imageUrl, image_origin_url, image_credit, id],
  );
}

async function ingestForPlaceId(placeId, { force = false, customQuery = null } = {}) {
  const place = await getPlace(placeId);
  if (!place) return { ok: false, reason: 'not_found' };

  if (place.image_url && !force) {
    return { ok: true, reason: 'skip_exists', image_url: place.image_url };
  }

  const searchTerm = customQuery || place.name;
  // 1) Pexels search
  const hit = await searchOne(searchTerm);
  if (!hit) return { ok: false, reason: 'pexels_no_result' };

  // 2) Download as buffer
  const buf = await downloadAsBuffer(hit.imageUrl);

  // 3) Upload to Cloudinary
  const publicId = `chapter-${place.id}-${slugify(place.name)}`;
  try {
    await destroyByPublicId(publicId);
  } catch (e) {
    console.warn('[INGEST] destroyByPublicId warning:', e?.message || e);
  }
  const result = await uploadBuffer(buf, publicId);

  // 4) Save in DB
  const photographer = hit.credit || 'Unknown';
  const creditText = `Photo by ${photographer} on Pexels`;

  await setImageFields(place.id, {
    imageUrl: result.secure_url,
    image_origin_url: hit.pexelsPageUrl || hit.imageUrl || null,
    image_credit: creditText,
  });

  return { ok: true, reason: 'updated', image_url: result.secure_url };
}

module.exports = { ingestForPlaceId };
