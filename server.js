const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Config
const config = require("./config/config");

// Init mongoDB
const database = require("./config/database");

// Schema
const { typeDefs, resolvers } = require("./schema");

// Apollo
const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");

// Socket IO
const { createServer } = require("http");
const { Server } = require("socket.io");

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "/assets/");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Check if a filename was sent in the form data
    cb(null, file.originalname);
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

async function startServer(typeDefs, resolvers) {
  // Start express app
  const app = express();

  // Define apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });

  // Start apollo
  await server.start();

  // Integrate with Express
  server.applyMiddleware({ app });

  // Serve static
  app.use(express.static("public"));
  
  // Upload endpoint using multer
  app.post("/assets", upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Archivo no encontrado." });
    }
    console.log(req.file);
    res.status(200).json({
      message: "Archivo subido correctamente.",
      filename: req.file.originalname,
      url: `/assets/${req.file.originalname}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  });

  app.get('/', (req, res) => {
    res.redirect("/Html/index.html");
  });

  // Socket.io
  const httpServer = createServer(app);
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    console.log("Connection");
  });

  // Listen
  httpServer.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`);
  });
}

startServer(typeDefs, resolvers);
