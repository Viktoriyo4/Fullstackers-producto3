const Panel = require('../models/Panel')
const { getIO } = require('../socket')

async function getPanel(id){
    return await Panel.findById({_id: id})
}

async function getPanels(){
    return await Panel.find()
}

async function updatePanel(args){
    const io = getIO()
    const panel = await Panel.findById({_id: args.id})

    panel.name = args.name
    panel.dueno = args.dueno
    panel.descripcion = args.descripcion

    const result = await panel.save()
    if (result && io){
        io.emit('panelUpdated', args)
    }
    return args
}

async function addPanel(args) {
    const io = getIO()
    const panel = new Panel(args)
    const savedPanel = await panel.save()

    if (savedPanel && io){
        io.emit("panelAdded", savedPanel)
    }
    return savedPanel
}

async function removePanel(id){
    const io = getIO()
    const removedPanel = await Panel.deleteOne({_id: id})

    if (removedPanel && io){
        io.emit("panelRemoved", id)
    }

    return removedPanel
}

module.exports = {
    getPanel,
    getPanels,
    addPanel,
    removePanel,
    updatePanel
}