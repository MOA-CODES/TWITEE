const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        minlength:3,
        maxlength:15,
    },
    email:{
        type: String,
        required: [true, 'Please provide a valid email address'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email address'
        ],
        unique:true,
    },
    password:{
        type:String,
        required: [true, 'Provide a password'],
        match:[
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/,
            'Password length should be >6 & have at least one lowercase, uppercase & special character'
        ],
    }
},{timestamps:true})

userSchema.pre('save', async function(){
    //name
    
    //password
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id,},process.env.SECRET_KEY,{expiresIn:process.env.SECRET_TIME,})
}

userSchema.methods.comparePSW = async function(userPassword){
    const compare = await bcrypt.compare(userPassword, this.password)
    return compare
}

module.exports = mongoose.model('User', userSchema)