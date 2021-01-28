const joi = require('joi')

const email = joi.string().email().lowercase().required()
const password = joi.string().min(8).max(20).required()
const id = joi.number().positive().required()
const username = joi.string().min(8).max(35).required()
const amount = joi.number().positive().min(1).required()

const signInSchema = joi.object({
    email,
    password
})

const signUpSchema = joi.object({
    email,
    username,
    password,
    confirmPassword : joi.ref('password'),
    phone : joi.string().length(10).pattern(/^[0-9]+$/).required(),
    addresses : joi.array().items(joi.string().min(8).max(50)).max(3).required()

})

const addItemSchema = joi.object({
    name : joi.string().min(5).max(35).required(),
    description : joi.string().min(10).max(150).required(),
    price : joi.number().positive().required()
})

const addToCartSchema = joi.object({
    itemId : id
})

const oAuthValidationSchema = joi.object({
    accessToken : joi.string().required(),
    oAuthId : id,
})

const addQuantitySchema = joi.object({
    itemId : id,
    quantity : joi.number().positive().max(5).min(1)
})

const createPaymentSchema = joi.object({
    amount
})

const executePaymentSchema = joi.object({
    paymentID : joi.string().required(),
    payerID : joi.string().required(),
    amount : amount,
    items : joi.number().positive().required()
})


module.exports = {
    signInSchema,
    signUpSchema,
    addItemSchema,
    addToCartSchema,
    oAuthValidationSchema,
    addQuantitySchema,
    createPaymentSchema,
    executePaymentSchema,
    email,
    id,
}

