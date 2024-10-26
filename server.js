// App
const express = require('express')

// Config
const config = require('./config/config')

// Init bd
const database= require('./config/database')


const panel = require('./models/Panel')
const task = require('./models/Task')

// Controllers
const dashboardController = require('./controllers/DashboardController')
const panelController = require('./controllers/PanelController')

// Start express
const app = express()

// Serve static
app.use(express.static('public'))

// Route controllers
app.use('/dashboard', dashboardController)
app.use('/panel', panelController)

// Listen
app.listen(config.port,  () => {console.log(`Listening on port: ${config.port}`)})
