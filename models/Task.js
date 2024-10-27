const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    dueDate: {type: Date, required: true},
    assignee: {type: String, required: true},
    idColumna: {type: Number, required:true}
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task;
