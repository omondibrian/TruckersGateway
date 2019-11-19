const bcrypt =require('bcryptjs');
const jwt =require('jsonwebtoken');
const UserModel =require('../model/user.model');
const { registrationValidation, loginValidation} =require('../misc/userValidation');
const dotenv =require('dotenv');
dotenv.config()

/**
 * @description resolver used to register users in the db
 * @param {*} args 
 */
 exports.RegisterUserResolver = async (args) => {
    const { name, password, houseId, mobileNumber, role } = args;
    //validate user data
    const { error } = registrationValidation(args)
    if (error) throw Error(error.details[0].message);
    const userToSave = await UserModel.findOne({ mobileNumber });

    if (userToSave) throw Error('user already exists');
    const encrptedPass = await bcrypt.hash(password, 10)

    let User = new UserModel({
        name,
        role,
        houseId,
        mobileNumber,
        password: encrptedPass
    })

    const APP_SECRET = 'fjdbdnfksdnk';
    const newUser = await User.save();
    const token = jwt.sign({ userId: newUser.id },APP_SECRET )

    return {
        token,
        user: newUser,
    }
}
 exports.loginUser = async (args) => {
     const APP_SECRET = 'fjdbdnfksdnk';
    const { name, password } = args;
    ///validate the user data
    // const { error } = loginValidation(args);
    // if (error) throw Error(error.details[0].message);
    const loginUser = await UserModel.findOne({ name });
    console.log(loginUser);
    if (!loginUser) throw Error('user doesn\'t exists');
    // const validPass = await bcrypt.compare(password, loginUser.password);
    // if (!validPass) throw Error('Error authenticating please try again')
     const token = jwt.sign({ userId: loginUser._id }, APP_SECRET, { expiresIn: 3600 })
    return {
        token,
        user: loginUser
    }
}
exports.fetchUserById = async(args)=>{
    return UserModel.findById(args.id)

}
