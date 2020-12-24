const joi = require('joi')

const signInSchema = joi.object({
    email : joi.string().email().lowercase().required(),
    password : joi.string().min(8).max(20).required()
})

const signUpSchema = joi.object({
    email : joi.string().email().lowercase().required(),
    password : joi.string().min(8).max(20).required(),
    username : joi.string().alphanum().min(8).max(20).required(),
    confirmPassword : joi.ref('password'),
    phone : joi.string().length(10).pattern(/^[0-9]+$/).required(),
    addresses : joi.array().items(joi.string().min(8).max(50)).required()

})

// const addItemSchema = joi.object({
//     name : ,
//     description : ,
//     price : 
// })

module.exports = {
    signInSchema,
    signUpSchema
}

