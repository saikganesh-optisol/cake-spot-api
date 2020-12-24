const sequelize = require('./connection')

module.exports = async () => {

    const UserAuthentication = require('./models/userAuthentication')
    const UserDetail = require('./models/userDetail')
    const UserCart = require('./models/userCart')
    const Item = require('./models/item')
    const Address = require('./models/address')


    await UserAuthentication.hasOne(UserDetail,{
        foreignKey : 'email'
    })
    await UserDetail.belongsTo(UserAuthentication,{
        foreignKey : 'email'
    })

    await UserDetail.hasMany(Address,{
        foreignKey : 'email'
    })
    await Address.belongsTo(UserDetail,{
        foreignKey : 'email'
    })

    await UserDetail.belongsToMany(Item,{
        through : UserCart,
        foreignKey : 'email'
    })
    await Item.belongsToMany(UserDetail,{
        through : UserCart,
        foreignKey : 'itemId'
    })
}

// sequelize.sync({force : true})
