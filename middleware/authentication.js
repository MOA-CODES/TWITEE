const jwt = require('jsonwebtoken')
const TBlacklist = require('../models/TBlacklist_M')
const {StatusCodes} =  require('http-status-codes')
const customError = require('../middleware/customError')

const auth = async(req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new customError('Authentication Invalid', StatusCodes.UNAUTHORIZED)
    }

    const token = authHeader.split(' ')[1]    

    const checkBlacklist = await TBlacklist.findOne({token})

    if(checkBlacklist && !(checkBlacklist === null)){
        throw new customError('You are logged out', StatusCodes.UNAUTHORIZED)
    }

    try{
        const payload = jwt.verify(token,process.env.SECRET_KEY)
        req.user = {userId: payload.userId,token}
        next()
    }catch(e){
        throw new customError('Authentication Invalid', StatusCodes.UNAUTHORIZED)
    }

}

module.exports = auth
