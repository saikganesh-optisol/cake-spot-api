const {Model, DataTypes} = require('sequelize')

const sequelize = require('../connection')

class UserDetail extends Model {}

UserDetail.init({

    email : {
        type : DataTypes.STRING(50),
        allowNull : false,
        primaryKey : true,
        references : {
            model : 'UserAuthentications',
            key : 'email'
        }
    },

    username : {
        type : DataTypes.STRING(35),
        allowNull : false,
    },

    phone : {
        type : DataTypes.INTEGER,
        allowNull : false
    }


},{
    sequelize,
    modelName : 'UserDetail',
    timestamps : false
})

module.exports = UserDetail