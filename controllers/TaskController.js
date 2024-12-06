const { Task } = require('../models/Task')

const PanelController = require('./PanelController')

async function getTask(id){
    return await Task.findById({_id: id})
}

async function addTask(args){
    const task = new Task({
        title: args.title,
        description: args.description, 
        dueDate: new Date(args.dueDate),
        assignee: args.assignee, 
        columnId: args.columnId,
    })
    
    const panel = await PanelController.getPanel(args.panelId)

    panel.tasks.push(task)
    await panel.save()

    return task
}

async function changeColumn(args){
    const panel = await PanelController.getPanel(args.panelId)
    const task = panel.tasks.id(args.id)

    task.columnId = args.columnId
    await panel.save()

    return task
}

async function updateTask(args){
    const panel = await PanelController.getPanel(args.panelId)
    const task = panel.tasks.id(args.id)

    task.title = args.title
    task.description = args.description
    task.assignee = args.assignee
    task.dueDate = new Date(args.dueDate)
    if (args.file && args.file.length > 0) {
        const filesData = args.file.map(file => ({
            filename: file.filename,
            url: file.url,
            size: file.size,
            mimetype: file.mimetype
        }));

        task.files = task.files.concat(filesData); 
    }
    await panel.save()

    return task
}

async function removeTask(args){
    const panel = await PanelController.getPanel(args.panelId)
    
    panel.tasks.pull(args.id)
    await panel.save()
    
    return
}

module.exports = {
    addTask,
    changeColumn,
    removeTask,
    updateTask,
    getTask,
}