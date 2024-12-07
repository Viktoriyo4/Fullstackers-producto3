// App
const express = require("express");
const app = express();
const { createServer } = require("http");
const httpServer = createServer(app);

// Files handling
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
const { initSocket } = require('./socket');

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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix);
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

async function startServer(typeDefs, resolvers) {
  // Start express app

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

  app.get('/download', (req, res) => {
    const { url, name } = req.query;

    if (!url || !name) {
        return res.status(400).send({ message: 'Faltan parámetros url o filename' });
    }

    const filePath = path.normalize(path.join(__dirname, '/assets', url));

    if (!filePath.startsWith(path.join(__dirname, '/assets'))) {
        return res.status(403).send({ message: 'Acceso denegado' });
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).send({ message: 'Archivo no encontrado' });
    }

    res.download(filePath, name, (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send({ message: 'Error al descargar el archivo' });
        }
    });
  });
  
  app.post("/assets", upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Archivo no encontrado." });
    }
    res.status(200).json({
      message: "Archivo subido correctamente.",
      filename: req.file.originalname,
      url: `${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  });

  app.get('/', (req, res) => {
    res.redirect("/Html/index.html");
  });

  // Socket.io
  initSocket(httpServer)

  // Listen
  httpServer.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`);
  });
}

startServer(typeDefs, resolvers);

