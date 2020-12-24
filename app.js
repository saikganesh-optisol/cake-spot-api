const express = require('express')
const bodyParser = require('body-parser')

//Establishing DB connnection
require('./src/database/connection')

//Executing bootstrap function
require('./src/bootstrap')()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/', (req,res)=>{
    res.status(200).send('<h1>Sequelize</h1>')
})

app.listen('3000',() => {
    console.log('Running on port 3000')
})