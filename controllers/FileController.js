const { File } = require('../models/File')

const TaskController = require('./TaskController')


async function addFile(args){
    const file = new File({
        filename: args.filename,
        url: args.url,
        size: args.size,
        mimetype: args.mimetype
    })
    
    const Task = await TaskController.getTask(args.taskId)

    Task.files.push(file)
    await Task.save()

    return file
}

module.exports = {
    addFile,
//    removeTask,
  //  updateTask,
    //getTask,
}
