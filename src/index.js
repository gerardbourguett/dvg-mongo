const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const ping = require("ping");
const socketIo = require("socket.io");
const routes = require("./routes");
const Svg = require("./models"); // Asegúrate de importar correctamente tu modelo

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;
const uri = process.env.ATLAS_URI || "mongodb://localhost:27017/svg";
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("pingIps", async (ip) => {
    try {
      const pingResults = [];
      for (const ips of ip) {
        const res = await ping.promise.probe(ips);
        pingResults.push({ ips, isAlive: res.alive });
      }

      console.log(pingResults);
    } catch (error) {
      console.error("Error during ping:", error);
      socket.emit("pingError", { message: "Error during ping operation" });
    }
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
