const jwt = require ('jsonwebtoken') 
const {configObject} = require ('../config/connectDB')


const {jwt_secret_key} = configObject

const generateToken = user => jwt.sign(user, jwt_secret_key, {
    expiresIn: '1d'
})


module.exports = { jwt_secret_key, generateToken } 