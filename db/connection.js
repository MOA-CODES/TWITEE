const mongoose = require('mongoose');

const connectDB = async()=>{

    try{
        return (await mongoose.connect(process.env.MONGO_URI)).isObjectIdOrHexString(()=>console.log('connected to MongoDb'))
    }catch(err){
        console.log(err).then(()=>process.exit(1))
    }
}

module.exports = connectDB