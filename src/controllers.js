const Svg = require("./models");

const getSvg = async (req, res) => {
  try {
    const svgs = await Svg.find();
    return res.json({ svgs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOneSvg = async (req, res) => {
  try {
    const svg = await Svg.findById(req.params.id);
    return res.json({ svg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postSvg = async (req, res) => {
  try {
    const { cx, cy, r, fill, description, type, ip_address } = req.body;
    if ((!cx, !cy || !r || !fill || !description || !type || !ip_address)) {
      return res.status(400).json({ message: "Please provide both cx and cy" });
    }
    const newSvg = new Svg({ cx, cy, r, fill, description, type, ip_address });
    const save = await newSvg.save();
    return res.json({ svg: save });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const putSvg = async (req, res) => {
  try {
    const { cx, cy, description, ip_address } = req.body;
    if (cx === undefined || cy === undefined) {
      return res.status(400).json({ message: "Please provide both cx and cy" });
    }

    const svg = await Svg.findById(req.params.id);
    if (!svg) {
      return res.status(404).json({ message: "SVG not found" });
    }

    svg.cx = cx;
    svg.cy = cy;
    svg.description = description;
    svg.ip_address = ip_address;
    const save = await svg.save();
    return res.json({ svg: save });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteSvg = async (req, res) => {
  try {
    const svg = await Svg.findByIdAndDelete(req.params.id);
    if (!svg) {
      return res.status(404).json({ message: "SVG not found" });
    }
    return res.json({ svg });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSvg, getOneSvg, postSvg, putSvg, deleteSvg };
