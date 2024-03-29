const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const TwitSchema  = mongoose.Schema({

    post:{
        type:String,
        required: [true, 'provide context for the post'],
        minlength: 1,
        maxlength: 50,
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
    postedBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Valid User is required']
    }

},{timestamps:true})

TwitSchema.pre('save', async function (){

    this.likes  = 0

})

module.exports = mongoose.model('Twit', TwitSchema)