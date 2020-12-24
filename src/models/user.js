const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define('user',{
    
    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        autoIncrement:true,
        primaryKey:true,
    },

    firstname : {
        type : Sequelize.STRING(35),
        allowNull : false,
    },

    lastname : {
        type : Sequelize.STRING(35),
        allowNull : false,
    },

    email : {
        type : Sequelize.STRING(35),
        allowNull:false,
        validate : {
            isEmail : true
        },
        unique : true,
    },

    age : {
        type : Sequelize.INTEGER(3),
        allowNull : false,
        validate : {
            isNumeric : true
        }
    },

    salary : {
        type : Sequelize.FLOAT(10,2),
        allowNull : false,
        validate : {
            isFloat : true
        }
    },

    password : {
        type : Sequelize.STRING(20),
        allowNull : false,
        validate : {
            isAlphanumeric : true
        }
    }

},{
    paranoid : true
});