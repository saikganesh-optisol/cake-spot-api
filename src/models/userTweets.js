const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const user = require('./user');
const tweet = require('./tweets')

module.exports = sequelize.define('userTweet',{
    userId : {
        type : Sequelize.INTEGER,
        model: user,
        key : 'id'
    },
    tweetId : {
        type : Sequelize.INTEGER,
        model : tweet,
        key : 'id'
    }
})