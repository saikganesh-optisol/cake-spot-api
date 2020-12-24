const {Model, DataTypes} = require('sequelize')

const sequelize = require('../connection')

class Address extends Model {}

Address.init({
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
    },

    email : {
        type : DataTypes.STRING(50),
        references : {
            model : 'UserDetails',
            key : 'email'
        }
    },

    address : {
        type : DataTypes.STRING(100),
        allowNull : false
    }
},{
    sequelize ,
    modelName : 'Address',
    timestamps : false
})

module.exports = Address