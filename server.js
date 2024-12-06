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
      origin: "http://localhost:8080",
      methods: ["GET", "POST"]
    }
  });

  let connectedUsers = 0;

  io.on("connection", (socket) => {
    connectedUsers ++;
    console.log("Usuario conectado, socket. Users: ", connectedUsers);

    socket.on("addTask", (arg) => {
      console.log("Data: ", arg)
      io.emit("taskAdded", arg);
    })
    
    socket.on("updateTask", (arg) => {
      io.emit("taskUpdated", arg)
    })

    socket.on("addPanel", (arg) => {
      io.emit("panelAdded", arg)
      console.log("Added: ", arg)
    })

    socket.on("removePanel", (arg) => {
      io.emit("panelRemoved", arg)
    })

    socket.on("changeTaskColumn", (arg) => {
      io.emit("taskColumnChanged", arg)
    })

    socket.on("removeTask", (arg) => {
      io.emit("taskRemoved", arg)
    })

    socket.on("disconnect", () => {
      connectedUsers --;
      console.log("Usuario desconectado, socket. Users: ", connectedUsers);
    });
  });

  // Listen
  httpServer.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`);
  });
}

startServer(typeDefs, resolvers);
