const { productModel }  = require ("../models/products.model")

class ProductManagerMongo {
    
    async getProducts() {
        return await productModel.find({status: true})
    }

    async getProduct (filter) {
        return await productModel.findOne (filter)
    }

    async createProduct (productNew) {
        return await productModel.create (productNew)
    }

    async updateProduct (pid, productToUpdate) {
        return await productModel.findOneAndUpdate({_id: pid}, productToUpdate, { new: true })
    }

    async deleteProduct (pid) {
        return await productModel.findByIdAndUpdate({_id: pid}, {status: false}, {new: true})
    }
}


module.exports = ProductManagerMongo