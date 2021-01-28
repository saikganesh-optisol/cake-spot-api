// General packages
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')

// Database connection and Table initialization
const sequelize = require('./database/connection')
global.sequelize = sequelize
require('./database/bootstrap')()


require('dotenv').config()

const sendGrid = require('@sendgrid/mail')
sendGrid.setApiKey(process.env.SEND_GRID_SECRET_KEY)

//App routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')


// Server Definition
const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/auth',authRoutes)
app.use('/user',userRoutes)

const PORT = 3001

app.listen(PORT,()=>{
    console.log('Listening on port',PORT)
})