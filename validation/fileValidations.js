const multer = require('multer')

const uploadImage = multer({
    limits : {
        fileSize :  5000000,
    },
    fileFilter : (req,file,done) => {
        const fileOriginalName = file.originalname
        if(!(fileOriginalName.endsWith('.jpg') || fileOriginalName.endsWith('.jpeg') || fileOriginalName.endsWith('.png')))
        {
            return done(new Error('Invalid file type'))
        }
        return done(null,true)
    }
})

module.exports = {
    uploadImage
}