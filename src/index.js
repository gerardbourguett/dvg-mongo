const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const app = express();
const port = process.env.PORT || 4000;
const uri = process.env.ATLAS_URI || "mongodb://localhost:27017/svg";

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use("/api", routes);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((error) => console.log(error));
