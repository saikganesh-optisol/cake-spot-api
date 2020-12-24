const {Model, DataTypes} = require('sequelize')

const sequelize = require('../connection')

class Item extends Model { }

Item.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },

    name : {
        type : DataTypes.STRING(35),
        allowNull : false,
    },

    description : {
        type : DataTypes.STRING(50),
        allowNull : true
    },

    price : {
        type : DataTypes.FLOAT(10,2),
        allowNull : false
    }
},{
    sequelize,
    modelName : 'Item',
    timestamps : false
})

module.exports = Item