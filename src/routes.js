const express = require("express");
const {
  getSvg,
  postSvg,
  putSvg,
  deleteSvg,
  getOneSvg,
  pingIp,
} = require("./controllers");
const router = express.Router();

router.get("/svg", getSvg);

router.get("/svg/:id", getOneSvg);

router.post("/svg", postSvg);

router.put("/svg/:id", putSvg);

router.delete("/svg/:id", deleteSvg);

router.get("/ping", pingIp);

module.exports = router;
