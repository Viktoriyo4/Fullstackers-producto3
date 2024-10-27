const mongoose = require('mongoose');
const { taskSchema } = require('./Task')

const panelSchema = new mongoose.Schema({
    name: {type: String, required: true},
    tasks: {type: [taskSchema]}
})
    
const Panel = mongoose.model('Panel', panelSchema)
  
module.exports = Panel