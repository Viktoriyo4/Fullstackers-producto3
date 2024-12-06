const { Task } = require('../models/Task')
const PanelController = require('./PanelController')

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
        const uploadedFiles = await Promise.all(args.file.map(async (file) => {
            const { createReadStream, mimetype } = file;
            const stream = createReadStream();

            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            const fileBuffer = Buffer.concat(chunks);

            return {
                data: fileBuffer,
                contentType: mimetype
            };
        }));

        task.archivos = uploadedFiles;
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
}