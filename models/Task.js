const mongoose = require('mongoose');

async function createTask(){
    const taskSchema = new mongoose.Schema({
        id: {type: Number, required: true},
        name: {type: String, required: true},
    })
    
    const Task = mongoose.model('Task', taskSchema)
}
createTask()