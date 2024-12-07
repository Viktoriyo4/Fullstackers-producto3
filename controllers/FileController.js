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
//    if (result && io){
//        io.emit('fileAdded', args)
//    }
    console.log("file ↓")
    console.log(file);

    return file
}

async function removeFile(args) {
//    const io = getIO()

//    Add ...

//    if (io && result){
//        io.emit('fileRemoved', args)
//    }
}

module.exports = {
    addFile,
//  removeFile,
}
