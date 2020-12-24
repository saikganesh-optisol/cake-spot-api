const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define('tweet',{
    
    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        autoIncrement:true,
        primaryKey:true,
    },

    title : {
        type : Sequelize.STRING(20),
        allowNull : false,
        unique : true,
    },
    
    content : {
        type : Sequelize.STRING(300) ,
        allowNull : false
    }

},{
    paranoid : true
});