const Panel = require('../models/Panel')

async function getPanel(id){
    return await Panel.findById({_id: id})
}

async function getPanels(){
    return await Panel.find()
}

async function updatePanel(args){
    // const io = getIO()
    const panel = await Panel.findById({_id: args.id})

    panel.name = args.name
    panel.dueno = args.dueno
    panel.descripcion = args.descripcion

    const result = await panel.save()
//    if (result && io){
//        io.emit('panelUpdated', args)
//    }
    return args
}

async function addPanel(args) {
    console.log("args ↓")
    console.log(args)
    try {
        const panel = new Panel(args);
        return await panel.save();
    } catch (error) {
        console.error("Error saving panel:", error);
    }
}

async function removePanel(id){
    return await Panel.deleteOne({_id: id})
}

module.exports = {
    getPanel,
    getPanels,
    addPanel,
    removePanel,
    updatePanel
}