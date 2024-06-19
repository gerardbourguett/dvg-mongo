const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const ping = require("ping");
const Server = require("socket.io");
const routes = require("./routes");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;
const uri = process.env.ATLAS_URI || "mongodb://localhost:27017/svg";
const io = Server(server);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.emit("ping");

  socket.on("pong", () => {
    console.log("Pong received");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

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

    server.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((error) => console.log("Error connecting to the database:", error));
