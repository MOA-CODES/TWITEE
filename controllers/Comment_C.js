const Twit = require('../models/Twit_M')
const User = require('../models/User_M')
const Comment = require('../models/Comments_M')
const {StatusCodes} = require('http-status-codes')
const customError = require('../middleware/customError')

const createComment = async (req, res)=>{

    const user = await User.findOne({_id:req.user.userId})

    if (!user){
        throw new customError('User does not exist', StatusCodes.NOT_FOUND)
    }

    req.body.commentedBy = req.user.userId
    req.body.twitRefrence = req.params.tid
    req.body.username = user.name

    let twitrefName;

    const twit = await Twit.findOne({_id:req.params.tid})
    const tcomment = await Comment.findOne({_id:req.params.tid})
    if(twit){
        twitrefName = twit.username

        const comment = await Comment.create({...req.body})
        res.status(StatusCodes.CREATED).json({msg:`you commented on ${twitrefName}'s twit`,comment})
    }
    if(tcomment){
        twitrefName = tcomment.username

        const comment = await Comment.create({...req.body})
        res.status(StatusCodes.CREATED).json({msg:`you commented on ${twitrefName}'s twit`,comment})
    }
}

const likeComment = async (req, res)=>{
    const userId = req.user.userId
    const commentId = req.params.cid

    let updates = {}

    const comment = await Comment.findOne({_id:commentId})

    if(!comment){
        throw new customError('Comment does not exist', StatusCodes.NOT_FOUND)
    }

    const getlikes = comment.likes

    if(!((comment.likedBy).indexOf(userId)== -1)){ //if you've already liked the twit
        updates.likes = getlikes-1

        const commentP1 = await Comment.findOneAndUpdate({_id:commentId},updates,{new:true, runValidators:true})
        const commentP2 = await Comment.findOneAndUpdate({_id:commentId},{'$pull':{'likedBy':userId}},{new:true, runValidators:true})


        res.status(StatusCodes.OK).json({msg:`you disliked ${comment.username}'s Comment`, currentlikes: commentP2.likes})
    }else{
        updates.likes = getlikes+1

        const commentP1 = await Comment.findOneAndUpdate({_id:commentId},updates,{new:true, runValidators:true})
        const commentP2 = await Comment.findOneAndUpdate({_id:commentId},{'$push':{'likedBy':userId}},{new:true, runValidators:true})
    
        res.status(StatusCodes.OK).json({msg:`you liked ${comment.username}'s Comment`, currentlikes: commentP2.likes})
    }
    
}

const deleteComment = async (req, res)=>{
    const userId = req.user.userId
    const commentId = req.params.cid

    const comment = await Comment.findOne({_id:commentId, commentedBy:userId})

    if(!comment){
        throw new customError('Comment does not exist', StatusCodes.NOT_FOUND)
    }
    
    res.status(StatusCodes.OK).json({msg:`Comment ${commentId} deleted successfully`})
}

module.exports = {createComment, deleteComment, likeComment}