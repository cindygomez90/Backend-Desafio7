const mongoose = require("mongoose")
const dotenv = require('dotenv')
const { program } = require("../utils/commander") 

const { mode } = program.opts() 
console.log(mode)

dotenv.config({ 
    path: mode === 'development' ? './.env.development' : './.env.production'   
})

module.exports.configObject = {        
    port: process.env.PORT || 8080, 
    mongo_url: process.env.MONGO_URL,
    jwt_secret_Key: process.env.JWT_SECRET_KEY 
}


module.exports = async () => {  
    try {
        await mongoose.connect(process.env.MONGO_URL) 
        console.log('Base de datos conectada')        
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error)
    }
}