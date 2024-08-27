const jwt = require('jsonwebtoken');

const key = 'supersercretkey@123'

function assignToken(user){
    const payload={
        _id:user._id,
        email:user.email,
        role:user.role,
        profileimage:user.profileimage
    }
    const token = jwt.sign(payload,key);
    return token;
}

function checkToken(token)
{
    try {
        return jwt.verify(token, key);
    } catch (error) {
        console.error('Token verification failed:', error.message);
        throw new Error('Invalid token');
    }
}

module.exports={
    assignToken,checkToken
}