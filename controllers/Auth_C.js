const User = require('../models/User_M')
const TBlacklist = require('../models/TBlacklist_M')
const customError = require('../middleware/customError')
const {StatusCodes} = require('http-status-codes')

const register = async (req, res) =>{
    const {email} = req.body

    let name = email.split('@')[0]
    name = name.replace("."," ")

    req.body.name = name

    const user = await User.create({...req.body})

    const token = user.createJWT()
res.status(StatusCodes.CREATED).json({user: {name: user.name,_id: user._id}, token})

}

const login = async (req, res) =>{
    const {email, password} = req.body

    if(!email || !password){
        throw new customError('Provide credentials', StatusCodes.BAD_REQUEST)
    }

    const user = await User.findOne({email})

    if (!user){
        throw new customError('User does not exist', StatusCodes.NOT_FOUND)
    }

    const passwordCheck = await user.comparePSW(password)
    if (!passwordCheck){
        throw new customError('Invalid Credentials', StatusCodes.UNAUTHORIZED)
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name: user.name, _id: user._id,login:"successful"}, token})
}

const logout = async (req, res)=>{

    const {userId , token} = req.user

    const user = await User.findOne({_id:userId})
   
    const blacklist = await TBlacklist.create({token})

    res.status(StatusCodes.OK).json({msg:`${user.name} logged out`})
}

module.exports = {register, login, logout}