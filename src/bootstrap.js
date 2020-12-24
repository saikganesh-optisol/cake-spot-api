const sequelize = require("./database/connection");

module.exports = async () => {
    
    // const userTweet = require('./models/userTweets')
    const user = require('./models/user')
    const tweet = require('./models/tweets')

    await user.belongsToMany(tweet,{
        through : 'userTweets',
        sourceKey : 'email',
        foreignKey : 'userEmail',
        as : 'myTweets',
    })
    
    await tweet.belongsToMany(user,{
        through : 'userTweets',
        sourceKey : 'title',
        as : 'myOwners',
        foreignKey : 'tweetTitle',
    })
    
    await sequelize.sync({force : true})

    const user1 = await user.create({
        firstname : 'Sai krishnan',
        lastname : 'G',
        email : 'saikrishnan2469@gmail.com',
        age : 20,
        salary : 35000.005,
        password : 'saiK1234',
    })

    const user2 = await user.create({
        firstname : 'Saai jeshwanth',
        lastname : 'J',
        email : 'saijeshwanth12@gmail.com',
        age : 20,
        salary : 40000.005,
        password : 'saaiJ1234',
    })

    const user3 = await user.create({
        firstname : 'Nithesh kumar',
        lastname : 'D',
        email : 'nitheskumar@gmail.com',
        age : 20,
        salary : 45000.005,
        password : 'nitheshD1234',
    })

    const tweet1 = await tweet.create({
        title : 'Sample tweet 1',
        content : 'This is a sample tweet',
    })

    const tweet2 = await tweet.create({
        title : 'Sample tweet 2',
        content : 'This is a sample tweet'
    })

    const tweet3 = await tweet.create({
        title : 'Sample tweet 3',
        content : 'This is a sample tweet'
    })

    await user1.setMyTweets([tweet1,tweet2])
    await tweet3.setMyOwners([user1,user2,user3])

    await user.destroy({
        where : {
            id : 1
        }
    })

    const result = await user.findAll({
        paranoid : false
    })

    console.log(JSON.stringify(result,null,2))
    
    
}