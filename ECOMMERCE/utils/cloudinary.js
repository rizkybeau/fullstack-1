const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dkznyufoa',
  api_key: '235719167691439',
  api_secret: '1ka4xYPylxpx3mDwNkJHpgVuUmo',
});

// Upload
const cloudinaryUploadimg = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUploads).then((result) =>
      resolve(
        {
          url: result.secure_url,
        },
        {
          resource_type: 'auto',
        }
      )
    );
  });
};

module.exports = cloudinaryUploadimg;
