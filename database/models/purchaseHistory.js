const {Model,DataTypes} = require('sequelize')

const sequelize = global.sequelize

class PurchaseHistory extends Model {}

PurchaseHistory.init({

    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },

    userId : {
        type : DataTypes.INTEGER,
        references : {
            model : 'UserDetails',
            key : 'id'
        },
        primaryKey : true
    },

    itemId : {
        type : DataTypes.INTEGER,
        references : {           
            model : 'Items',
            key : 'id'
        },
        primaryKey : true
    },

    quantity : {
        type : DataTypes.INTEGER,
        allowNull : false
    },

    unitPrice : {
        type : DataTypes.FLOAT,
        allowNull : false
    },

    purchasedOn : {
        type : DataTypes.DATE,
        primaryKey : true
    },

    paymentId : {
        type : DataTypes.STRING,
        allowNull : false
    }

},{
    timestamps : false,
    updatedAt : false,
    sequelize,
    modelName : 'PurchaseHistory'
})


module.exports = PurchaseHistory