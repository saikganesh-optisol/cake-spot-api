const {Model,DataTypes} = require('sequelize')
const sequelize = global.sequelize

class TransactionDetail extends Model {}

TransactionDetail.init({
    
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
        }
    },

    paymentId : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },

    paymentMethod : {
        type : DataTypes.STRING,
        allowNull : false
    },

    amount : {
        type : DataTypes.FLOAT,
        allowNull : false
    }



},{
    sequelize,
    timestamps : true,
    createdAt : true,
    updatedAt: false,
    modelName : 'TransactionDetail'
})

module.exports = TransactionDetail