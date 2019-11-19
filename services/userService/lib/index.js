const { ApolloServer, gql } = require("apollo-server");
const path = require('path')
const mongoose = require('mongoose')
const {createWriteStream } = require('fs')
const { buildFederatedSchema } = require("@apollo/federation");
const { RegisterUserResolver, loginUser, fetchUserById} = require('./Resolver/user.resolver')

///data layer imports
const UserModel = require('./model/user.model')
//conect mongoDb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Home_manegment_DB', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', function () {
    console.log('connection made sucessfull');

}).on('error', function (error) {
    console.log('connection error:', error)
})

/**
 * @description sub-data graph for the users service
 */
const typeDefs = gql`
 extend type Query {
      users:[User!]! ,
      login(name:String!,password:String!):Auth,
      user(id:ID!):User!
}
extend type Mutation {
    signup(name:String!,mobileNumber:String!,role:String!,password:String!):Auth,
    singleUpload(file:Upload!):Boolean!
}
#     type File {
#     filename: String!
#     mimetype: String!
#     encoding: String!
#   }
  type User @key(fields: "id") {
    id:ID!,
    name:String!,
    mobileNumber:String!,
    role:String!,
    profileimage:String!
  }
  type Auth{
    token:String!,
    user:User!
}
`;

const resolvers = {
    Query: {
        users:() => UserModel.find({}) ,
        login: (_, args, context) => {
            return loginUser(args)
        },
        user:(_,args) => UserModel.findById({_id:args.id}),
        User: {
            __resolveReference(args) {
                    console.log(args)
                return fetchUserById(args.id);
            }
        },
    },
    Mutation: {
        signup: (root, args, context) => {
            console.log(args.profileimage);
            return RegisterUserResolver(args)
        },
        singleUpload:async (_, { file }) => {
        const { createReadStream, filename } = await file;
        console.log(file)
        await new Promise(res =>
            createReadStream()
            .pipe(createWriteStream(path.join(__dirname,"uploads",filename)))
            .on("close",res)
            );
        return true;
    }

    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([
        {
            typeDefs,
            resolvers
        }
    ])
});
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

