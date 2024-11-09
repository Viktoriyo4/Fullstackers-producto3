const mongoose = require('mongoose');
const config = require('./config/config');

mongoose.connect(config.uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conexión exitosa a MongoDB");
    // Puedes hacer algo adicional aquí si la conexión es exitosa, como insertar un documento de prueba
  })
  .catch((err) => {
    console.error("Error de conexión:", err);
  });
