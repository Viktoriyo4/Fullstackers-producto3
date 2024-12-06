const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true }
})
    
const File = mongoose.model('File', fileSchema)
  
module.exports = {File, fileSchema}