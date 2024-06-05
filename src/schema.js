const mongoose = require("mongoose");

const svgSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  cx: {
    type: Number,
    required: true,
  },
  cy: {
    type: Number,
    required: true,
  },
  r: {
    type: Number,
    required: true,
  },
  fill: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  ip_address: {
    type: String,
    required: false,
  },
  ip_status: {
    type: Boolean,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = svgSchema;
