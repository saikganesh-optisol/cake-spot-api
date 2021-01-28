const {Model, DataTypes} = require('sequelize')

const sequelize = global.sequelize

class UserCart extends Model {}

UserCart.init({
    
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },

    userId : {
        type : DataTypes.INTEGER,
        references : {
            model : 'UserDetails',
            key : 'id'
        }
    },

    itemId : {
        type : DataTypes.INTEGER,
        references : {           
            model : 'Items',
            key : 'id'
        }
    },

    quantity : {
        type : DataTypes.INTEGER
    },
},{
    sequelize,
    modelName : 'UserCart',
    timestamps : false
})

module.exports = UserCart