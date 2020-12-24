const Sequelize = require('sequelize')

const sequelize = new Sequelize('socialNetwork','root','root',{
    host : '127.0.0.1',
    dialect : 'mysql',
    logging : false
})

try
{
    sequelize.authenticate().then(() => console.log('Connection Successful'))
}
catch(error)
{
    console.log('Connection not established')
}

module.exports = sequelize
global.sequelize = sequelize