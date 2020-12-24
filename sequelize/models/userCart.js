const {Model, DataTypes} = require('sequelize')

const sequelize = require('../connection')

class UserCart extends Model {}

UserCart.init({
    
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },

    email : {
        type : DataTypes.STRING(50),
        references : {
            model : 'UserDetails',
            key : 'email'
        }
    },

    itemId : {
        type : DataTypes.INTEGER,
        references : {
            model : 'Items',
            key : 'id'
        }
    }
},{
    sequelize,
    modelName : 'UserCart',
    timestamps : false
})

module.exports = UserCart