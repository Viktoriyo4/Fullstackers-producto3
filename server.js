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

  // Listen
  app.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`);
  });

  // Socket.io
  const httpServer = createServer(app);
  const io = new Server(httpServer, { /* options */ });
  httpServer.listen(3000);
  io.on("connection", (socket) => {
    // ...
  });
  
}
startServer(typeDefs, resolvers);
