const { MenuItem } = require('../models/MenuItem');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { destroyFile } = require('../Utils/cloudinary');

const editMenuItem = async (req, res) => {
  const { id } = req.params;

  const item = await MenuItem.findById(id);
  if (!item) {
    return res.status(401).send({ error: "No menuItem found to update!" });
  }
  if (payload.imageId) {
    await destroyFile(item.imageId);
  }
  await MenuItem.findByIdAndUpdate(id, req.body);
  res.status(200).send({ success: "item updated successfully!" });
}

const deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  const item = await MenuItem.findById(id);
  if (!item) {
    return res.status(401).send({ error: "No menuItem found to delete!" });
  }
  await destroyFile(item.imageId);

  await MenuItem.findByIdAndDelete(id);
  res.status(200).send({ success: "item deleted successfully!" });
}

module.exports = { editMenuItem, deleteMenuItem }