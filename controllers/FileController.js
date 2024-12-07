const { File } = require('../models/File')

const TaskController = require('./TaskController')
const PanelController = require('./PanelController')
// TODO: Sockets
// const { getIO } = require('../socket')

async function addFile(args){
//    const io = getIO()
    const file = new File({
        filename: args.filename,
        url: args.url,
        size: args.size,
        mimetype: args.mimetype
    })
    
    const Panel = await PanelController.getPanel(args.panelId)
    const Task = Panel.tasks.id(args.taskId)
    Task.files.push(file)
    const result = await Panel.save()
    return {
        id: file._id.toString(),
        filename: file.filename,
        url: file.url,
        size: file.size,
        mimetype: file.mimetype,
    };


}

async function getFile(args){
    const Panel = await PanelController.getPanel(args.panelId)
    const Task = Panel.tasks.id(args.taskId)
    const file = Task.files.id(args.fileId)
    return {
        filename: file.filename,
        url: file.url,
    };
}

async function removeFile(args) {
//    const io = getIO()

//    Add ...

//    if (io && result){
//        io.emit('fileRemoved', args)
//    }

    const Panel = await PanelController.getPanel(args.panelId)
    const Task = Panel.tasks.id(args.taskId)
    Task.files.pull(args.id)
    await Panel.save()
    return
}

module.exports = {
    addFile,
    getFile,
    removeFile,
  //  updateTask,
    //getTask,
}
