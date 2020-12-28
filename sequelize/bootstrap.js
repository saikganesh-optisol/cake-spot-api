const sequelize = require('./connection')

module.exports = async () => {

    const UserDetail = require('./models/userDetail')
    const UserCart = require('./models/userCart')
    const Item = require('./models/item')
    const Address = require('./models/address')

    UserDetail.hasMany(Address,{
        foreignKey : 'userId',
        sourceKey : 'id'
    })
    Address.belongsTo(UserDetail,{
        foreignKey : 'userId',
        targetKey : 'id'
    })

    UserDetail.belongsToMany(Item,{
        through : UserCart,
        foreignKey : 'userId',
        sourceKey : 'id'
    })
    
    Item.belongsToMany(UserDetail,{
        through : UserCart,
        foreignKey : 'itemId',
        sourceKey : 'id'
        
    })
}

// sequelize.sync({force : true})
