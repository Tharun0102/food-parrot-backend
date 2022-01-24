const { MenuItem } = require('../models/MenuItem');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const editMenuItem = async (req, res) => {
  const { id } = req.params;

  const item = await MenuItem.findById(id);
  if (!item) {
    return res.status(401).send({ error: "No menuItem found to update!" });
  }

  let changes = req.body;
  if (req.file) {
    changes.imageUrl = req.file.path;
    removeUploadedImage(item.imageUrl);
  }
  await MenuItem.findByIdAndUpdate(id, changes);
  res.status(200).send({ success: "item updated successfully!" });
}

const deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  const item = await MenuItem.findById(id);
  if (!item) {
    return res.status(401).send({ error: "No menuItem found to delete!" });
  }
  removeUploadedImage(item.imageUrl);

  await MenuItem.findByIdAndDelete(id);
  res.status(200).send({ success: "item deleted successfully!" });
}

const removeUploadedImage = (imageUrl) => {
  filepath = path.join(__dirname, "../", imageUrl);
  fs.unlink(filepath, (err) => {
    console.log(err);
  });
}

module.exports = { editMenuItem, deleteMenuItem }