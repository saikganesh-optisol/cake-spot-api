const {Model, DataTypes} = require('sequelize')

const sequelize = require('../connection')
const UserDetail = require('./userDetail')

class Address extends Model {}

Address.init({
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
    },

    userId : {
        type : DataTypes.INTEGER,
        references : {
            model : UserDetail,
            key : 'id'
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