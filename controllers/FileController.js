const { File } = require('../models/File')

const TaskController = require('./TaskController')
const PanelController = require('./PanelController')


async function addFile(args){
    const file = new File({
        filename: args.filename,
        url: args.url,
        size: args.size,
        mimetype: args.mimetype
    })
    
    const Panel = await PanelController.getPanel(args.panelId)
    const Task = Panel.tasks.id(args.taskId)
    Task.files.push(file)
    await Panel.save()

    return file
}

module.exports = {
    addFile,
//    removeTask,
  //  updateTask,
    //getTask,
}
