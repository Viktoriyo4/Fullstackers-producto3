// App
const express = require("express");

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

  app.get('/', (req, res) => {
    res.redirect("/Html/index.html");
  });

  // Socket.io
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:8080",  // Change this to your client's URL
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Usuario conectado, socket");

    socket.on("addTask", (arg) => {
      socket.emit("taskAdded", arg);
    });
    
    socket.on("updateTask", (arg) => {
      socket.emit("taskUpdated", arg)
    })

    socket.on("addPanel", (arg) => {
      socket.emit("panelAdded", arg)
    })

    socket.on("removePanel", (arg) => {
      socket.emit("panelRemoved", arg)
    })

    socket.on("changeTaskColumn", (arg) => {
      socket.emit("taskColumnChanged", arg)
    })

    socket.on("removeTask", (arg) => {
      socket.emit("taskRemoved", arg)
    })

    socket.on("disconnect", () => {
      console.log("Usuario desconectado, socket");
    });
  });

  // Listen
  httpServer.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`);
  });
}

startServer(typeDefs, resolvers);
