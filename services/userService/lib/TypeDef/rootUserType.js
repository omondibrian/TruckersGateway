const { gql } = require('apollo-server');

module.exports = gql`
         type Query {
            users:[User!]! ,
            login(name:String!,password:String!):Auth,
            user(id:ID!):User!
        }
         type Mutation {
            signup(name:String!,mobileNumber:String!,role:String!,password:String!):Auth
            }
        type File {
            filename: String!
            mimetype: String!
            encoding: String!
            }
        type User @key(fields: "id") {
            id:ID!,
            name:String!,
            mobileNumber:String!,
            role:String!,
            }
        type Auth{
            token:String!,
            user:User!
        }
`