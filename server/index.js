const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRouter = require("./Routes/auth");
const visitorRoutes = require("./Routes/visitor");
const analyticsRoutes = require("./Routes/analytics");
const plateRouter = require("./Routes/plate");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const { pollVisitorLogs } = require("./services/visitorService");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 4000;

app.use(express.json());

const DB = process.env.MONGODB_URI;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection to MongoDB successful");
  })
  .catch((e) => {
    console.error("MongoDB connection error:", e);
  });

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log("Received request:", req.method, req.url);
  next();
});

app.post("/", (req, res) => {
  console.log("User is connected");
  res.send("User is connected");
});

app.use("/api", visitorRoutes);
app.use(authRouter);
app.use(analyticsRoutes);
app.use("/api", plateRouter); // Check the routes

// Real-time updates with Socket.io
io.on("connection", (socket) => {
  console.log("A client connected");

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

pollVisitorLogs(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Connection error ", err.stack);
  res.status(500).send("Something broke!");
  console.error("User connected");
  next();
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
