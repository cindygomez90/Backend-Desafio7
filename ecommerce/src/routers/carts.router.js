//importación de módulos
const { Router } = require ("express")
const CartController = require("../controllers/carts.controller")

const cartsRouter = Router ()
const { createCart, getCart, addProductToCart, updateProductQuantity, deleteProductFromCart, deleteAllProductsFromCart } = new CartController

//Endpoint para solicitar un carrito por id
cartsRouter.get ('/:cid', getCart)

//Endpoint para crear un carrito
cartsRouter.post ('/', createCart )

//Endpoint para agregar un producto a un carrito
cartsRouter.post('/:cid/products/:pid', addProductToCart)

//Endpoint para actualizar el carrito con un arreglo de productos
cartsRouter.put('/:cid', )


//Endpoint para actualizar solo la cantidad de un producto en el carrito
cartsRouter.put('/:cid/products/:pid', updateProductQuantity)

//Endpoint para eliminar un producto de un carrito
cartsRouter.delete('/:cid/products/:pid', deleteProductFromCart)

//Endpoint para eliminar todos los productos de un carrito
cartsRouter.delete('/:cid', deleteAllProductsFromCart)


module.exports = cartsRouter