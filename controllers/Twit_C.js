const Twit = require('../models/Twit_M')
const User = require('../models/User_M')
const {StatusCodes} = require('http-status-codes')
const customError = require('../middleware/customError')

const createTwit = async (req, res)=>{

    const user = await User.findOne({_id:req.user.userId})

    if (!user){
        throw new customError('User does not exist', StatusCodes.NOT_FOUND)
    }

    req.body.username = user.name
    req.body.postedBy = req.user.userId

    const twit = await Twit.create({...req.body})
    res.status(StatusCodes.CREATED).json(twit)

}

const likeTwit = async (req, res)=>{
    const TwitId = req.params.id
    const userId = req.user.userId

    let updates = {}

    const gettwit = await Twit.findOne({_id:TwitId})

    if (!gettwit){
        throw new customError('Twit does not exist', StatusCodes.NOT_FOUND)
    }

    const getlikes = gettwit.likes

    if(!((gettwit.likedBy).indexOf(userId)== -1)){ //if you've already liked the twit
        updates.likes = getlikes-1

        const twitP1 = await Twit.findOneAndUpdate({_id:TwitId},updates,{new:true, runValidators:true})
        const twitP2 = await Twit.findOneAndUpdate({_id:TwitId},{'$pull':{'likedBy':userId}},{new:true, runValidators:true})


        res.status(StatusCodes.OK).json({msg:`you disliked ${gettwit.username}'s Twit`, currentlikes: twitP2.likes})
    }else{
        updates.likes = getlikes+1

        const twitP1 = await Twit.findOneAndUpdate({_id:TwitId},updates,{new:true, runValidators:true})
        const twitP2 = await Twit.findOneAndUpdate({_id:TwitId},{'$push':{'likedBy':userId}},{new:true, runValidators:true})
    
        res.status(StatusCodes.OK).json({msg:`you liked ${gettwit.username}'s Twit`, currentlikes: twitP2.likes})
    }
}

const deleteTwit = async (req, res)=>{
    const userId = req.user.userId
    const TwitId = req.params.id
    
    const twit = await Twit.findOneAndDelete({_id:TwitId, postedBy:userId})

    if(!twit){
        throw new customError(`No Twit of yours with id ${TwitId} exists`, StatusCodes.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json({msg: `Twit (${TwitId}) deleted successfully`})
}

module.exports = {createTwit, deleteTwit, likeTwit}