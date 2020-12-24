// General packages
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')

// Validators
const {signInSchema,signUpSchema} = require('./helpers/validationSchema')

// Database connection and Table initialization
const sequelize = require('./sequelize/connection')
require('./sequelize/bootstrap')()
const {UserAuthentication,UserDetail,UserCart,Item,Address} = sequelize.models


const PORT = 3001


// Server Definition
const app = express()
app.use(cors())
app.use(bodyParser.json())


// Endpoints

app.get('/signIn',async (req,res)=>{
    try
    {
        await signInSchema.validateAsync(req.query)

        const {email,password} = req.query

        const user = await UserAuthentication.findOne({
            attributes : ['email'],
            where : {
                email,password
            },
            include : {
                model : UserDetail,
                attributes : ['username','phone'],
                required : true,
                include : {
                    model : Address,
                    attributes : ['address']
                }
            },
        })
    
        if(user === null)
        {
            return res.status(400).send('User not found')
        }

        res.status(200).send(user)
    }
    catch(error)
    {
        console.log(error.message)
        return res.status(400).send('Error signing in !!')
    }

})

app.get('/shop',async (req,res)=>{
    
    try
    {
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

app.post('/addItem', async (req,res) => {
    
    const {name,description,price} = req.body

    try
    {
        
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

app.get('/cart',async (req,res)=>{
    const {email} = req.query
    
    try
    {
        const cartItemsId = await UserCart.findAll({
            where : {
                email
            }
        })
    
        const cartItems = cartItemsId.map(async (element) => {
            const cartItem = await Item.findOne({
                where : {
                    id : element.id
                }
            }).then(item => ({
                id : item.id,
                name : item.name,
                price : item.price
            }))
        })

        res.status(200).send(cartItems)
    }
    catch(error)
    {
        res.status(400).send('failed')
    }

})

app.post('/addToCart',async (req,res)=> {
    const {email,id} =  req.body
    try
    {
        await UserCart.create({
            email,
            itemId : id
        })

        res.status(200).send('success')
    }
    catch(error)
    {
        console.log(error)
        res.status(400).send('failed')
    }
})

app.post('/signUp',async (req,res)=>{

    try
    {
        await signUpSchema.validateAsync(req.body)

        const {username,email,password,addresses,phone} = req.body

        await UserAuthentication.create({
            email,password
        })
        
        await UserDetail.create({
            email,
            username,
            phone
        })
    
        await Address.bulkCreate(addresses.map(address => ({
            email,
            address
        })))

        res.status(200).send({username,email,phone,addresses})
    }
    catch(error)
    {
        console.log(error)
        res.status(400).send('Error signing up , Try again later !!')
    }

})

app.listen(PORT,()=>{
    console.log('Listening on port',PORT)
})