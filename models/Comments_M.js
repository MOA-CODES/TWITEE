const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const commentSchema = mongoose.Schema({

    comment:{
        type: String,
        required: [true, 'provide context for the comment'],
        minlength: '3',
        maxlenght: '50'
    },
    username:{
        type: String,
        ref:'User',
    },
    likes:{
        type: Number,
    },
    likedBy:{
        type: [Schema.Types.ObjectId],
        ref:'User',
        default: [],
    },
    twitRefrence:{
        type: mongoose.Types.ObjectId,
        required: true,
    },
    commentedBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Valid User is required']
    }
},{timestamps:true})

commentSchema.pre('save', async function(){

    this.likes = 0;

})

module.exports = mongoose.model('Comments', commentSchema)