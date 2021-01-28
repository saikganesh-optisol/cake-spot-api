const sequelize = global.sequelize

module.exports = async () => {

    const UserDetail = require('./models/userDetail')
    const UserCart = require('./models/userCart')
    const Item = require('./models/item')
    const Address = require('./models/address')
    const PurchaseHistory = require('./models/purchaseHistory')
    const TransactionDetail = require('./models/transactionDetail')
    const UserVerification = require('./models/UserVerification')

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

    UserDetail.hasMany(PurchaseHistory,{
        foreignKey : 'userId',
        sourceKey : 'id'
    })

    PurchaseHistory.belongsTo(UserDetail,{
        foreignKey : 'userId',
        targetKey : 'id'
    })

    UserDetail.hasMany(TransactionDetail,{
        foreignKey : 'userId',
        sourceKey : 'id'
    })

    TransactionDetail.belongsTo(UserDetail,{
        foreignKey : 'userId',
        targetKey : 'id'
    })

    UserDetail.hasOne(UserVerification,{
        foreignKey : 'userId',
        sourceKey : 'id'
    })
}

sequelize.sync({force : true})
