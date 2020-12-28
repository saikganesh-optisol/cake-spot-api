const joi = require('joi')

const email = joi.string().email().lowercase().required()
const password = joi.string().min(8).max(20).required()
const id = joi.number().positive().required()

const signInSchema = joi.object({
    email,
    password
})

const signUpSchema = joi.object({
    email,
    password,
    username : joi.string().alphanum().min(8).max(35).required(),
    confirmPassword : joi.ref('password'),
    phone : joi.string().length(10).pattern(/^[0-9]+$/).required(),
    addresses : joi.array().items(joi.string().min(8).max(50)).required()

})

const addItemSchema = joi.object({
    name : joi.string().min(5).max(35).required(),
    description : joi.string().min(10).max(50).required(),
    price : joi.number().positive().required()
})

const cartSchema = joi.object({
    userId :id
})

const addToCartSchema = joi.object({
    userId : id,
    itemId : id
})



module.exports = {
    signInSchema,
    signUpSchema,
    addItemSchema,
    cartSchema,
    addToCartSchema
}

