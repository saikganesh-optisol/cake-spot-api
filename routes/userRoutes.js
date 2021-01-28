const route = require('express').Router()

const {validateToken} = require('../authentication/jwtUtils')
const {getUtcDate} = require('../utils')

const {paypalApi} = require('../global')
const axios = require('axios').default

const { uploadImage } = require('../validation/fileValidations')
const {addItemSchema,addToCartSchema,addQuantitySchema,id,createPaymentSchema,executePaymentSchema} = require('../validation/validationSchema')

const sharp = require('sharp')

const sequelize = global.sequelize
const {Item,UserCart,PurchaseHistory,TransactionDetail} = sequelize.models

route.get('/shop',validateToken,async (req,res) => {
    try
    {
        // Fetching all items in the database
        const items = await Item.findAll({
            attributes : [['id','itemId'],'name','description','price']
        })

        res.status(200).send(items)
    }
    catch(error)
    {
        console.log(error)
        res.status(400).send('failed')
    }

})

route.post('/addItem',validateToken,uploadImage.single('picture'),async (req,res) => {
    try
    {
        //Validating details of the item

        const {name,description,price} = req.body
        const picture = await sharp(req.file.buffer).resize({width : 250 , height : 250})
                        .png().toBuffer()


        await Item.create({
            name,description,price,picture
        })

        return res.status(200).send('success')
    }
    catch(error)
    {
        console.log(error)
        return res.status(400).send('failed')
    }

},(error,req,res,next) => {
    res.status(400).send('failed')
})

route.get('/cart',validateToken,async (req,res)=>{
    
    try
    {
        const userId = req.userId

        const cartItems = await UserCart.findAll({
            where : {
                userId,
            },
        })

        // Rejecting if the user doesnt have anything in the cart
        if(!cartItems.length)
        {
            return res.status(404).send('No items found')
        }
        
        // Fetching all items of the user from collection based on id
        const cartItemDetails = await Promise.all(cartItems.map(async (element) => {
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
                quantity :  element.quantity
            }

            return details
        }))
        
        return res.status(200).send(cartItemDetails)
    }
    catch(error)
    {
        console.log(error)
        return res.status(400).send('failed')
    }

})

route.post('/addToCart',validateToken,async (req,res)=> {
    try
    {   
        // Validating 
        await addToCartSchema.validateAsync(req.body)

        const {itemId} = req.body
        const userId = req.userId

        const existingCart = await UserCart.findOne({
            where : {
                userId,
                itemId,
            }
        })

        if(existingCart)
        {
            const existingQuantity = existingCart.quantity
            let newQuantity = existingQuantity+1
            newQuantity = newQuantity > 5 ? 5 : newQuantity
            
            existingCart.quantity = newQuantity

            await existingCart.save()
        }
        else
        {
            await UserCart.create({
                userId,
                itemId,
                quantity : 1,
            })
        }

        res.status(200).send('success')
    }
    catch(error)
    {
        console.log(error)
        res.status(400).send('failed')
    }
})

route.get('/itemImage/:itemId',async (req,res) => {
    
    try
    {
        const {itemId} = req.params

        await id.validateAsync(parseInt(itemId))

        const item = await Item.findOne({
            where : {
                id : itemId
            },
            attributes : ['picture']
        })

        if(!item)
        {
            return res.sendStatus(404)
        }
        
        const picture = item.picture


        res.set('Content-Type','image/png')

        return res.status(200).send(picture)
    }
    catch(error)
    {
        return res.sendStatus(400)
    }

})

route.put('/changeQuantity',validateToken,async(req,res) => {
    
    try
    {
        const userId = req.userId

        await addQuantitySchema.validateAsync(req.body)

        const {quantity,itemId} = req.body

        const cartItem = await UserCart.findOne({
            where : {
                userId,
                itemId,
            }
        })

        if(!cartItem)
        {
            return res.sendStatus(404)
        }

        cartItem.quantity = quantity

        await cartItem.save()

        return res.sendStatus(200)
    }
    catch(error)
    {
        return res.sendStatus(401)
    }

})

route.post('/createPayment',validateToken,async (req,res) => {
    
    try
    {  
        await createPaymentSchema.validateAsync(req.body)

        const {amount} = req.body

        const response = await axios.post(paypalApi+'/v1/payments/payment',{
            intent: 'sale',
            payer : {
                payment_method: 'paypal'
            },
            transactions: [{
                amount: {
                    total: amount,
                    currency: 'INR'
                }
            }],
            redirect_urls:
            {
                return_url: 'http://localhost:3000/dashboard/shop',
                cancel_url: 'https://localhost:3000/dashboard/cart'
            }
        },{
            auth : {
                username : process.env.PAYPAL_CLIENT_ID,
                password : process.env.PAYPAL_CLIENT_SECRET
            },
            json : true
        })

        const {data} = response
        
        return res.status(200).send(data)
    }
    catch(error)
    {
        return res.sendStatus(401)
    }

})

route.post('/executePayment',validateToken,async (req,res) => {
    
    try
    {
        await executePaymentSchema.validateAsync(req.body)

        const {paymentID,payerID,amount,items} = req.body

        const userId = req.userId

        const cartItems = await UserCart.findAll({
            where : {
                userId,
            }
        })

        if(!cartItems)
        {
            return res.sendStatus(401)
        }

        const cartItemDetails = await Promise.all(cartItems.map(async (cartItem) => {
            const itemDetails = await Item.findOne({
                where : {
                    id : cartItem.itemId
                },
                attributes : ['id','price']
            })
            
            return itemDetails
        }))

        if(!cartItemDetails)
        {
            return res.sendStatus(401)
        }

        const [totalItems,totalPrice] = await cartItems.reduce((acc,item,index) => {
            const quantity = item.quantity
            acc[0] += quantity
            const price = cartItemDetails[index].price
            acc[1] += quantity * price
            console.log(acc)
            return acc

        },[0,0])

        if((totalPrice !== amount) || (totalItems !== items))
        {
            return res.sendStatus(401)
        }

        const response = await axios.post(`${paypalApi}/v1/payments/payment/${paymentID}/execute`,{
            payer_id: payerID,
            transactions: [
            {
                amount: {
                    total: totalPrice,
                    currency: 'INR'
                }
            }]
        },{
            auth : {
                username : process.env.PAYPAL_CLIENT_ID,
                password : process.env.PAYPAL_CLIENT_SECRET
            },
            json : true
        })

        const {id,payer:{payment_method},transactions} = response.data
        const {amount : {details : {subtotal}}} = transactions[0]

        await TransactionDetail.create({
            paymentId : id,
            userId : req.userId,
            paymentMethod : payment_method,
            amount : subtotal

        })

        cartItems.forEach(async (cartItem,index) => {
            await PurchaseHistory.create({
                userId : req.userId,
                itemId : cartItemDetails[index].id,
                quantity : cartItem.quantity,
                unitPrice : cartItemDetails[index].price,
                purchasedOn : getUtcDate(),
                paymentId : id
            })

            await cartItem.destroy()
        })
        
        return res.status(200).send('success')
    }
    catch(error)
    {
        return res.sendStatus(400)
    }
})

module.exports = route