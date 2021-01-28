const {Model, DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')

const sequelize = require('../connection')

class UserDetail extends Model {}

UserDetail.init({

    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },

    password : {
        type : DataTypes.STRING,
        allowNull : false
    },

    username : {
        type : DataTypes.STRING(35),
        allowNull : false,
    },

    phone : {
        type : DataTypes.INTEGER,
        allowNull : true,
    },

    oAuthId : {
        type : DataTypes.STRING,
        allowNull : true
    },

    accessToken : {
        type : DataTypes.STRING,
        allowNull : true,
    },

    domain : {
        type : DataTypes.STRING,
        allowNull : false
    },

    isVerified : {
        type : DataTypes.BOOLEAN,
        allowNull : false
    }


},{
    sequelize,
    modelName : 'UserDetail',
    timestamps : false
})

module.exports = UserDetail