const { RegisterUserResolver, loginUser } = require('../controller/User.Controller')
const UserModel = require('../model/user.model')

module.exports = {
    Query: {
        users: () => UserModel.find({}),
        login: (_, args, context) => {
            return loginUser(args)
        },
        user: {
            __resolveReference(args) {
                return fetchUserById(args.user);
            }
        },
    },
    Mutation: {
        signup: (root, args, context) => {
            console.log(args.profileimage);
            return RegisterUserResolver(args)
        }
    }
};