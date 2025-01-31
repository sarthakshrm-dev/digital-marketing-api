const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  home: { type: Object },
  aboutUs: { type: Object },
  services: { type: Object },
  ourWork: { type: Object }
});

module.exports = mongoose.model('ContentData', itemSchema);
