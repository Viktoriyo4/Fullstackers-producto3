const { Task } = require('../models/Task')
const PanelController = require('./PanelController')
const { getIO } = require('../socket')

async function addTask(args){
    const io = getIO()
    const task = new Task({
        title: args.title,
        description: args.description, 
        dueDate: new Date(args.dueDate),
        assignee: args.assignee, 
        columnId: args.columnId,
    })
    
    const panel = await PanelController.getPanel(args.panelId)

    panel.tasks.push(task)
    const savedPanel = await panel.save()
    if (io && savedPanel){
        io.emit("taskAdded", args, task._id)
    }
    return task
}

async function changeColumn(args){
    const io = getIO()
    const panel = await PanelController.getPanel(args.panelId)
    const task = panel.tasks.id(args.id)

    task.columnId = args.columnId
    const savedPanel = await panel.save()
    if (savedPanel && io){
        io.emit("taskColumnChanged", args)
    }
    return task
}

async function updateTask(args){
    const io = getIO()
    const panel = await PanelController.getPanel(args.panelId)
    const task = panel.tasks.id(args.id)

    task.title = args.title
    task.description = args.description
    task.assignee = args.assignee
    task.dueDate = new Date(args.dueDate)
    const savedPanelWithTask = await panel.save()
    if (savedPanelWithTask && io){
        io.emit("taskUpdated", args)
    }
    return task
}

async function removeTask(args){
    const io = getIO()
    const panel = await PanelController.getPanel(args.panelId)
    
    panel.tasks.pull(args.id)
    const saved = await panel.save()
    if (saved && io){
       io.emit("taskRemoved", args);
    }
    return saved
}

module.exports = {
    addTask,
    changeColumn,
    removeTask,
    updateTask,
}
