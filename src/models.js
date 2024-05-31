const mongoose = require("mongoose");
const svgSchema = require("./schema");

const svgModel = mongoose.model("Svg", svgSchema);

module.exports = svgModel;
