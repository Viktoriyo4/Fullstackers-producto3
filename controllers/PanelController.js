const database = require('mongoose')
const Panel = require('../models/Panel')

async function getPanel(id){}

async function getPanels(){}

async function addPanel(args){
    const panel = new Panel(args)
    return await panel.save()
}

async function removePanel(args){
    return await Panel.deleteOne({_id: args.id})
}

module.exports = {
    getPanel,
    getPanels,
    addPanel,
    removePanel,
}