const route = require('express').Router()

const {signInSchema,oAuthValidationSchema,signUpSchema,email} = require('../validation/validationSchema')

const fetch = require('node-fetch') 

const HMAC_SHA256 = require('crypto-js/hmac-sha256')
const bcrypt = require('bcrypt')
const {generateAuthenticationToken,validateToken} = require('../authentication/jwtUtils')

const sequelize = global.sequelize
const {UserDetail,Address,UserVerification} = sequelize.models
const rawQuery = sequelize.query

const sendGridMail = require('@sendgrid/mail')
sendGridMail.setApiKey(process.env.SEND_GRID_SECRET_KEY)


route.post('/authenticate',validateToken,async(req,res) => {
    
    try
    {
        await email.validateAsync(req.userEmail)

        const existingUser = await UserDetail.findOne({
            where : {
                email : req.userEmail
            }
        })

        if(!existingUser)
        {
            return res.status(401).send(null)
        }
        else
        {
            const userAddresses = await Address.findAll({
                where : {
                    userId : existingUser.id
                },
                attributes : ['address']
            })

            const signedInUser = {
                email : existingUser.email,
                username : existingUser.username,
                phone : existingUser.phone,
                addresses : userAddresses
            }

            const userToken = generateAuthenticationToken({id : existingUser.id,email : existingUser.email})

            return res.status(200).send({
                signedInUser,
                userToken
            })
        }
    }
    catch(error)
    {
        return res.status(401).send(null)
    }
})

route.post('/email',async (req,res) => {

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
        if(!user)
        {
            return res.status(404).send('User not found')
        }

        if(!user.isVerified)
        {
            return res.status(400).send('Unverified User')
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

        const userToken = generateAuthenticationToken({id : user.id,email : user.email})

        //Sending user data as a response
        res.status(200).send({
            signedInUser,userToken
        })

    }
    catch(error)
    {
        return res.status(400).send('Error signing in !!')
    }   

})

route.post('/signUp',async (req,res)=>{
    try
    {
        // Checking sign up credentials
        await signUpSchema.validateAsync(req.body)

        let {username,email,password,addresses,phone} = req.body

        let newUser,verificationToken

        // hashing the password 
        password = await bcrypt.hash(password,10)

        // Creating a transaction
        await sequelize.transaction(async (transaction) => {

            newUser = await UserDetail.create({
                email,
                password,
                username,
                phone,
                oAuthId : null,
                accessToken : null,
                domain : 'email',
                isVerified : false
            },{
                transaction
            })

            if(addresses.length)
            {
                await Address.bulkCreate(addresses.map(address => ({
                    userId : newUser.id,
                    address
                })),{
                    transaction
                })
            }
            verificationToken = await bcrypt.hash(email,10)

            await UserVerification.create({
                userId : newUser.id,
                verificationToken
            },{
                transaction
            }).then(() => {
                return rawQuery(`CREATE EVENT expireToken ON SCHEUDULE AT CURRENT_TIMESTAMP + 1 DAY DO 
                    DELETE FROM userverifications WHERE userId = ${newUser.id}`)
            }).then(() => console.log('query executed'))


            const verificationLink = `http://localhost:3001/auth/emailVerification?userId=${newUser.id}&email=${email}`

            const verificationMessage = {
                to : email,
                from : 'saikrishnan.g@optisolbusiness.com',
                subject : 'CAKE SPOT - Email Verification',
                text : 'Hey , did you signup at CAKE-SPOT ? If so , click the link',
                html : `<a href="${verificationLink}">Link</a>`
            }

            await sendGridMail.send(verificationMessage)
        })

        return res.status(200).send('success')
    }
    catch(error)
    {
        console.log(error)
        return res.status(400).send('error')
    }

})

route.get('/emailVerification',async (req,res) => {

    try
    {
        const {userId,email} = req.query

        const unverifiedUser = await UserVerification.findOne({
            where : {
                userId
            }
        })

        if(!unverifiedUser)
        {
            return res.status(400).send('failed')
        }

        const isEqual = await bcrypt.compare(email,unverifiedUser.verificationToken)

        if(!isEqual)
        {
            return res.status(400).send('failed')
        }

        const userDetails = await UserDetail.findOne({
            where : {
                id : userId
            }
        })

        if(!userDetails)
        {
            return res.status(400).send('failed')
        }

        userDetails.isVerified = true
        await userDetails.save()

        return res.redirect(200,'http://localhost:3000/')
    }
    catch(error)
    {
        console.log(error)
        return res.status(400).send('failed')
    }
})

route.post('/facebook',async (req,res) => {

    try
    {
        await oAuthValidationSchema.validateAsync(req.body)
        const {oAuthId,accessToken} = req.body
        const facebookGraphUrl = `https://graph.facebook.com/${oAuthId}/?fields=id,email,name&access_token=${accessToken}&appsecret_proof=${HMAC_SHA256(accessToken,process.env.FACEBOOK_SECRET_KEY).toString()}`
        const response = await fetch(facebookGraphUrl,{ method : 'get'})
        const data = await response.json()
        if(!data)
        {
            return res.status(401).send('Login failed')
        }
        
        const {id,email,name} = data

        const existingUser = await UserDetail.findOne({
            where : {
                email
            }
        })

        if(!existingUser)
        {
            const password = await bcrypt.hash(email,10)
            const newUser = await UserDetail.create({
                email,
                username : name,
                oAuthId : id,
                password,
                accessToken,
                phone : null,
                domain : 'facebook'
            })

            const signedInUser = {
                email : newUser.email,
                username : newUser.username,
            }

            const userToken = generateAuthenticationToken({id : newUser.id,email})

            return res.status(200).json({
                signedInUser,
                userToken
            })
        }
        else
        {
            const signedInUser = {
                email : existingUser.email,
                username : existingUser.username,
                phone : null,
                addresses : []
            }

            const userToken = generateAuthenticationToken({id : existingUser.id,email})

            return res.status(200).json({
                signedInUser,
                userToken
            })
        }
    }
    catch(error)
    {   
        return res.send(401).send('Login failed')
    }
})

module.exports = route