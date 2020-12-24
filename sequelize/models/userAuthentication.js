const {Model, DataTypes} = require('sequelize')

const sequelize = require('../connection')

class UserAuthentication extends Model{}

UserAuthentication.init({

    email : {
        type : DataTypes.STRING(50),
        allowNull : false,
        unique : true,
        primaryKey : true
    },

    password : {
        type : DataTypes.STRING(20),
        allowNull : false
    },
},{
    sequelize,
    modelName : 'UserAuthentication',
    timestamps : false
})

module.exports = UserAuthentication