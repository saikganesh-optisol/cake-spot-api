const jwt = require('jsonwebtoken')

const generateAuthenticationToken = (userDetails) => {
    try
    {
        return jwt.sign(userDetails,process.env.JWT_SECRET_KEY,{
            expiresIn : '24h'
        })
    }
    catch(error)
    {
        console.log(error)
    }
}

const validateToken = (req,res,next) => {
    
    try
    {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if(!token)
        {
            return res.status(401).send('Bad Request')
        }
        const data = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.userEmail = data.email
        req.userId = data.id
        next()
    }
    catch(error)
    {
        console.log(error)
        return res.status(403).send('Error')
    }
}

module.exports = {
    generateAuthenticationToken,
    validateToken
}