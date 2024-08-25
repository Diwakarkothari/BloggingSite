const {Schema, model} = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { assignToken } = require('../services/authentication');

const userSchema = new Schema({
    fullName: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    salt:{
        type:String    
    },
    password: {
        type: String
    },
    profileImageURL:{
        type:String,
        default:'/images/avatar.png'
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    }
},{timestamps:true});

/*
Full Example of Password Storage Workflow:
    User Signup:
        User submits a password.
        A salt is generated.
        The password is hashed using the salt.
        Both the salt and the hashed password are stored in the database.
    User Login:
        User submits their password.
        The stored salt is retrieved from the database.
        The password is hashed again using the salt.
        The hashed value is compared to the stored hashed password to verify if they match.
*/ 

userSchema.pre("save",function (next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256',salt).
    update(user.password).
    digest('hex');

    this.salt = salt;
    this.password = hashedPassword;
    next();
})

userSchema.static('matchPasswordAndGenerateToken', async function (email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error('User does not exist');
    const salt= user.salt;
    const hashedPassword = user.password;

    const givenPassword = createHmac('sha256',salt).update(password).
    digest('hex');

    if(givenPassword!==hashedPassword)
        throw new Error('Invalid Password');

    const token = assignToken(user);
    return token;
})

const User = model('user',userSchema);

module.exports = User;