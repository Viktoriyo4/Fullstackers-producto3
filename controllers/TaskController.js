const database = require('mongoose')
const Task = require('../models/Task')

async function addTask(args){}
async function changeColumn(args){}
async function removeTask(args){}
async function getTasksByPanelId(id){}

module.exports = {
    addTask,
    changeColumn,
    removeTask,
    getTasksByPanelId,
}