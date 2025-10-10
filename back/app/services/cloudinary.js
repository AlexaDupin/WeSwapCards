const cloudinary = require('cloudinary').v2;

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER = 'places',
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

function slugify(s) {
  return (s || '')
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80);
}

function destroyByPublicId(publicId) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
    invalidate: true,
  });
}

async function uploadBuffer(buffer, publicIdHint) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        public_id: publicIdHint,
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
      },
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
}

module.exports = { uploadBuffer, destroyByPublicId, slugify };
