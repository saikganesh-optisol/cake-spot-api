const {Model,DataTypes} = require('sequelize')
const sequelize = global.sequelize

class UserVerification extends Model {}

UserVerification.init({

    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },

    userId : {
        type : DataTypes.INTEGER,
        references : {
            model : 'userDetails',
            key : 'id'
        }
    },

    verificationToken : {
        type : DataTypes.STRING,
        allowNull : false
    }
},{
    sequelize,
    createdAt : true,
    updatedAt: false
})

module.exports = UserVerification