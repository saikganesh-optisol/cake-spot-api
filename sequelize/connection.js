const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('sequelizeCommerce','root','root',{
    dialect : 'mysql',
    host : 'localhost',
    logging : false,
})

try 
{
    sequelize.authenticate().then(() => console.log('Connection Established'))
}
catch(error)
{
    console.log('Error :',error.message)
}

module.exports =  sequelize