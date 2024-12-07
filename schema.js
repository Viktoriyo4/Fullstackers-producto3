// https://www.npmjs.com/package/apollo-server-express
// The `apollo-server-express` package is part of Apollo Server v2 and v3, which are now end-of-life (as of October 22nd 2023 and October 22nd 2024, respectively). This package's functionality is now found in the `@apollo/server` package. See https://www.apollographql.com/docs/apollo-server/previous-versions/ for more details.
// https://www.apollographql.com/docs/apollo-server/v3/getting-started
const { gql } = require('apollo-server-express')
const TaskController = require('./controllers/TaskController')
const PanelController = require('./controllers/PanelController')
const FileController = require('./controllers/FileController')

//TODO Update panel?
const typeDefs = gql(`
   type File{
        id: ID!
        filename: String!
        url: String!
        size: Int!
        mimetype: String!
   }
   
    type Task {
        id: ID!
        title: String!
        description: String!
        dueDate: String!
        assignee: String!
        columnId: ID!
        files: [File!]!
    }

    type Panel {
        id: ID!
        name: String!
        dueno: String!
        descripcion: String!
        tasks: [Task!]!
    }

    type Query {
        panel(id: ID!): Panel
        panels: [Panel]
        file(panelId: ID!, taskId: ID!, fileId: ID!): File
    }

    type Mutation {
        addPanel(name: String!, dueno: String!, descripcion: String!): Panel,
        addTask(panelId: ID!, title: String!, description: String!, dueDate: String!, assignee: String!, columnId: ID!): Task,
        addFile(panelId: ID!, taskId: ID!, filename: String!, url: String!, size: Int!, mimetype: String!): File,

        changeTaskColumn(panelId: ID!, id: ID!, columnId: ID!): Task,
        updateTask(panelId: ID!, id: ID!, title: String!, description: String!, assignee: String!, dueDate: String!): Task,
        updatePanel(id: ID!, name: String!, dueno: String!, descripcion: String!): Panel

        removePanel(id: ID!): Panel,
        removeTask(panelId: ID!, id: ID!): Task,
        removeFile(id: ID!, taskId: ID!, panelId: ID!): File
    }
`)

const resolvers = {
    Query: {
        panel: async (parent, args) => {
            return await PanelController.getPanel(args.id)
        },
        panels: async (parent, args) => {
            return await PanelController.getPanels()
        },
        file: async (parent, args) => {
            return await FileController.getFile(args)
        }
    },
    Mutation: {
        addPanel: async (parent, args) => {
            return await PanelController.addPanel(args)
        },
        addTask: async (parent, args) => {
            return await TaskController.addTask(args)
        },
        addFile: async (parent, args) => {
            return await FileController.addFile(args)
        },

        changeTaskColumn: async (parent, args) => {
            return await TaskController.changeColumn(args)
        },
        updateTask: async (parent, args) => {
            return await TaskController.updateTask(args)
        },
        updatePanel: async (parent, args) => {
            return await PanelController.updatePanel(args)
        },

        removePanel: async (parent, args) => {
            return await PanelController.removePanel(args.id)
        },
        removeTask: async (parent, args) => {
            return await TaskController.removeTask(args)
        },
        removeFile: async (parent, args) => {
            return await FileController.removeFile(args)
        },
    },
}

module.exports = { typeDefs, resolvers }