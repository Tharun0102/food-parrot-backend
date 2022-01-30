require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadController = async (req, res) => {
  try {
    const fileStr = req.body.imageStr;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'food-parrot-images'
    });
    res.status(200).send(uploadResponse?.public_id);
  } catch (err) {
    console.error("error", err);
    res.status(500).json({ err: 'Something went wrong' });
  }
}

const destroyFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    throw Error("couldn't remove old image!");
  }
}

module.exports = { cloudinary, uploadController, destroyFile };