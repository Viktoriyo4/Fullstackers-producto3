const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    dueDate: {type: Date, required: true},
    assignee: {type: String, required: true},
    columnId: {type: Number, required:true},
    file: [{data: Buffer, contentType: String}]
})

const Task = mongoose.model('Task', taskSchema)

module.exports = {Task, taskSchema}
