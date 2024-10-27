// https://www.npmjs.com/package/apollo-server-express
// The `apollo-server-express` package is part of Apollo Server v2 and v3, which are now end-of-life (as of October 22nd 2023 and October 22nd 2024, respectively). This package's functionality is now found in the `@apollo/server` package. See https://www.apollographql.com/docs/apollo-server/previous-versions/ for more details.
// https://www.apollographql.com/docs/apollo-server/v3/getting-started
const { gql } = require('apollo-server-express')
const Panel = require('./models/Panel')
const Task = require('./models/Task')

const typeDefs = gql(`
    scalar Date

    type Task {
        id: ID!
        title: String!
        description: String!
        dueDate: Date!
        assignee: String!
        idColumna: ID!
    }

    type Panel {
        id: ID!
        name: String!
        tasks: [Task]
    }

    type Query {
        tasks: [Task]
        panels: [Panel]
    }
`)

const resolvers = {
    Query: {
        tasks: async () => {
            return await Task.find(); 
        },
        panels: async () => {
            return await Panel.find();
        },
    }
}

module.exports = { typeDefs, resolvers }