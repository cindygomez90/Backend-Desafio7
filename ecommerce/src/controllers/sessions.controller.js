const UserManagerMongo = require("../dao/Mongo/usersManagerMongo")
const bcrypt = require('bcrypt')
const UserManagerMongo = require ('../dao/Mongo/usersManagerMongo')
const ProductManagerMongo = require ('../dao/Mongo/productsManagerMongo')
const { generateToken }  = require ('../utils/jsonwebtoken')

const sessionService = new UserManagerMongo ()
const productService = new ProductManagerMongo ()

class SessionController {

    constructor () {
        this.sessionService = new UserManagerMongo ()
    }

    register = async (request, responses)=>{
        try {        
            const {first_name, last_name, email, password, role} = request.body       
            console.log (first_name, last_name, email, password, role)
            if (first_name === '' || password === '') {
                return res.send ('Faltan llenar campos obligatorios')
            } 
    
            const existingUser = await this.sessionService.getUserBy({ email })
            if (existingUser) {
                return res.send({
                    status: 'error',
                    error: 'El correo electrónico ya está registrado',
                })
            }
    
            const hashedPassword = await bcrypt.hash(password, 10)
        
            const newUser = {
                first_name,
                last_name,
                email,
                password: hashedPassword,
                role: role || 'USER'
            }
            const result = await this.sessionService.createUser (newUser)
            const token = generateToken({
                id: result._id
            })
            responses.cookie('cookieToken', token, {
                maxAge: 60 * 60 * 1000 * 24,       
                httpOnly: true  
            }).send({   
                status: 'success',
                usersCreate: result, 
                token   
            })
        } catch (error) {
            res.send ({status:'error', error:error.message})        
        }
    }
}

    failregister = async (request, responses) => {
        responses.send({error: 'falla en el register'})
    }

    login = async (request, responses)=>{
        const {email, password} = request.body       
        
        const user = await this.sessionService.getUserBy ({email}) 
        console.log (user)
        if (!user) {
            return res.send ({
                status: 'error', 
                error: 'Usuario con ese mail no existe'
            })
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password)
    
        if (!isPasswordValid) {
            return res.send({ status: 'error', error: 'Contraseña incorrecta' })
        }
    
        const token = generateToken({
            fullname: `${user.first_name} ${user.last_name}`, 
            id: user._id,
            email: user.email,
            role: user.role
        })
        responses.cookie('cookieToken', token, {
            maxAge: 60*60*1000*24,  
            httpOnly: true 
        })
    
        const products = await productService.getProducts()
        res.render('products', { user: user, products})
    }

    faillogin = async (request, responses) => {
        responses.send({error: 'falla en el register'})
    }

    current = async (request, responses) => {       
        try {
            const currentUser = request.user;
    
            if (!currentUser) {
                return responses.status(404).json({
                    status: 'error', 
                    error: 'User not found' 
                })
            }
            const responseData = {
                id: currentUser.id,
                email: currentUser.email
            }
    
            res.json(responseData)
        } catch (error) {
            console.error('Error al recuperar datos del usuario:', error)
            res.status(500).json({ status: 'error', error: 'Error del servidor' })
        }
    }

    logout = (request, responses) => {
        responses.clearCookie('cookieToken') 
        responses.redirect('/login')
    }

    GitHub = async(request, responses) => {
        console.log('request.user:', request.user)
        const user = request.user.user
        const products = await productService.getProducts()
        responses.render('products', { user: user, products })
    }


module.exports = SessionController