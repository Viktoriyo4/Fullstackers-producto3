// https://www.npmjs.com/package/apollo-server-express
// The `apollo-server-express` package is part of Apollo Server v2 and v3, which are now end-of-life (as of October 22nd 2023 and October 22nd 2024, respectively). This package's functionality is now found in the `@apollo/server` package. See https://www.apollographql.com/docs/apollo-server/previous-versions/ for more details.
// https://www.apollographql.com/docs/apollo-server/v3/getting-started
const { gql } = require('apollo-server-express')
const TaskController = require('./controllers/TaskController')
const PanelController = require('./controllers/PanelController')

const typeDefs = gql(`
    type Task {
        id: ID!
        title: String!
        description: String!
        dueDate: String!
        assignee: String!
        columnId: ID!
    }

    type Panel {
        id: ID!
        name: String!
        tasks: [Task!]!
    }

    type Query {
        panel(id: ID!): Panel
        panels: [Panel]
    }

    type Mutation {
        addPanel(name: String!): Panel,
        addTask(panelId: ID!, title: String!, description: String!, dueDate: String!, assignee: String!, columnId: ID!): Task,

        changeTaskColumn(panelId: ID!, id: ID!, columnId: ID!): Task,

        removePanel(id: ID!): Panel,
        removeTask(panelId: ID!, id: ID!): Task,
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
    },
    Mutation: {
        addPanel: async (parent, args) => {
            return await PanelController.addPanel(args)
        },
        addTask: async (parent, args) => {
            return await TaskController.addTask(args)
        },

        changeTaskColumn: async (parent, args) => {
            return await TaskController.changeColumn(args)
        },

        removePanel: async (parent, args) => {
            return await PanelController.removePanel(args.id)
        },
        removeTask: async (parent, args) => {
            return await TaskController.removeTask(args)
        },
    },
}

module.exports = { typeDefs, resolvers }