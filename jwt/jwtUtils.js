const jwt = require('jsonwebtoken')

const generateAuthenticationToken = (userDetails) => {
    console.log(process.env.SECRET_KEY)
    try
    {
        return jwt.sign(userDetails,process.env.SECRET_KEY,{
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
        jwt.verify(token,process.env.SECRET_KEY)
        next()
    }
    catch(error)
    {
        return res.status(403).send('Error')
    }
}

module.exports = {
    generateAuthenticationToken,
    validateToken
}