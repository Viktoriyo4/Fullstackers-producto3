const { Task } = require('../models/Task')

const PanelController = require('./PanelController')
const { getIO } = require('../socket')

async function getTask(id){
    let task = await Task.findById(id);
    return task;
}

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
    const newTask = panel.tasks.id(args.id)
    let taskNewIndex = panel.tasks.findIndex(task => task._id.equals(args.topTaskID))
    let taskCurrentIndex = panel.tasks.findIndex(task => task._id.equals(newTask._id))

    newTask.columnId = args.columnId
    panel.tasks.splice(taskCurrentIndex, 1)
    if (taskNewIndex > -1){
        if (taskNewIndex > taskCurrentIndex){
            taskNewIndex = taskNewIndex - 1;
        }
        panel.tasks.splice(taskNewIndex, 0, newTask)
    } else {
        panel.tasks.push(newTask)
    }
    const savedPanel = await panel.save()
    if (savedPanel && io){
        io.emit("taskColumnChanged", args)
    }
    return newTask
}

async function updateTask(args){
    const io = getIO()
    const panel = await PanelController.getPanel(args.panelId)
    const task = panel.tasks.id(args.id)

    task.title = args.title
    task.description = args.description
    task.assignee = args.assignee
    task.dueDate = new Date(args.dueDate)
    // if (args.file && args.file.length > 0) {
    //     const filesData = args.file.map(file => ({
    //         filename: file.filename,
    //         url: file.url,
    //         size: file.size,
    //         mimetype: file.mimetype
    //     }));

    //     task.files = task.files.concat(filesData); 
    // }
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
    getTask,
}
