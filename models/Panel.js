const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema({
    name: {type: String, required: true},
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
})
    
const Panel = mongoose.model('Panel', panelSchema)
  
module.exports = Panel