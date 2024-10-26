const express = require('express')
const config = require('./config/config')
const database = require('./config/database')
const dashboardController = require('./controllers/DashboardController')
const panel = require('./models/Panel')
const task = require('./models/Task')

const app = express()

app.use(express.static('public'))

app.use('/dashboard', dashboardController)

app.listen(config.port,  () => {console.log(`Listening on port: ${config.port}`)})
