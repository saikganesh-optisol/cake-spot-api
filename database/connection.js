const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('reactecommerce','root','root',{
    dialect : 'mysql',
    host : 'localhost',
    logging : console.log,
})

try 
{
    sequelize.authenticate().then(() => console.log('Connection Established'))
}
catch(error)
{
    console.log('Error :',error.message)
}

global.sequelize = sequelize
module.exports =  sequelize