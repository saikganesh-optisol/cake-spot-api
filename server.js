// General packages
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')

require('dotenv').config()

// Validators
const {signInSchema,signUpSchema,addItemSchema,cartSchema,addToCartSchema} = require('./joi/validationSchema')

//Token generators
const {generateAuthenticationToken,validateToken} = require('./jwt/jwtUtils')

// Database connection and Table initialization
const sequelize = require('./sequelize/connection')
require('./sequelize/bootstrap')()
const {UserDetail,UserCart,Item,Address} = sequelize.models


const PORT = 3001


// Server Definition
const app = express()
app.use(cors())
app.use(bodyParser.json())

// Util functions
const displayError = (error) => console.log('Error :',error)

// Endpoints
app.post('/signIn',async (req,res)=>{
    try
    {
        // validating request body
        await signInSchema.validateAsync(req.body)

        const {email,password} = req.body

        // Checking if email exists
        const user = await UserDetail.findOne({
            where : {
                email
            }
        })
        //Rejecting if particular email is not found

        if(!Object.keys(user).length)
        {
            return res.status(404).send('User not found')
        }
        
        //If email exists, checking if password matches with hashed password
        const isEqual = await bcrypt.compare(password,user.password)

        //Reject if password does not match
        if(!isEqual)
        {
            return res.status(401).send('Invalid credentials')
        }

        //If credentials match , fetching the addresses of the user
        const userAddresses = await Address.findAll({
            where : {
                userId : user.id
            },
            attributes : ['address']
        })

        const signedInUser = {
            email : user.email,
            username : user.username,
            phone : user.phone,
            addresses : userAddresses
        }

        const userToken = generateAuthenticationToken({email : user.email})
        console.log(userToken)

        //Sending user data as a response
        res.status(200).send({
            signedInUser,userToken
        })

    }
    catch(error)
    {
        console.log(error.message)
        return res.status(400).send('Error signing in !!')
    }

})

app.get('/shop',validateToken,async (req,res)=>{
    
    try
    {
        // Fetching all items in the database
        const items = await Item.findAll({
            attributes : ['name','description','price']
        })

        res.status(200).send(items)
    }
    catch(error)
    {
        res.status(400).send('failed')
    }

})

app.post('/addItem', validateToken,async (req,res) => {
    
    try
    {
        //Validating details of the item
        await addItemSchema.validateAsync(req.body)

        const {name,description,price} = req.body

        await Item.create({
            name,description,price
        })

        res.status(200).send('success')
    }
    catch(error)
    {
        res.status(400).send('failed')
    }

})

app.get('/cart',validateToken,async (req,res)=>{
    
    try
    {
        // Validating details of the cart
        await cartSchema.validateAsync(req.query)

        const {userId} = req.query

        const cartItemsId = await UserCart.findAll({
            where : {
                userId
            },
        })

        // Rejecting if the user doesnt have anything in the cart
        if(!cartItemsId.length)
        {
            return res.status(404).send('No items found')
        }
        
        // Fetching all items of the user from collection based on id
        const cartItems = await Promise.all(cartItemsId.map(async (element) => {
            const item = await Item.findOne({
                where : {
                    id : element.itemId
                }
            })

            const details = {
                id : item.id,
                name : item.name,
                description : item.description,
                price : item.price,
            }

            return details
        }))
        
        return res.status(200).send(cartItems)
    }
    catch(error)
    {
        displayError(error)
        return res.status(400).send('failed')
    }

})

app.post('/addToCart',validateToken,async (req,res)=> {
    
    try
    {   
        // Validating 
        await addToCartSchema.validateAsync(req.body)

        const {userId,itemId} = req.body

        await UserCart.create({
            userId,
            itemId
        })

        res.status(200).send('success')
    }
    catch(error)
    {
        res.status(400).send('failed')
    }
})

app.post('/signUp',async (req,res)=>{

    try
    {
        // Checking sign up credentials
        await signUpSchema.validateAsync(req.body)

        let {username,email,password,addresses,phone} = req.body

        // hashing the password 
        password = await bcrypt.hash(password,2)

        // Creating a transaction
        await sequelize.transaction(async (transaction) => {

            const user = await UserDetail.create({
                email,
                password,
                username,
                phone
            },{
                transaction
            })

            await Address.bulkCreate(addresses.map(address => ({
                userId : user.id,
                address
            })),{
                transaction
            })
        })

        const signedUpUser = {username,email,phone,addresses}
        const userToken = generateAuthenticationToken({email})

        res.status(200).send({
            signedUpUser,userToken
        })
    }
    catch(error)
    {
        displayError(error)
        res.status(400).send('Error signing up , Try again later !!')
    }

})

app.listen(PORT,()=>{
    console.log('Listening on port',PORT)
})