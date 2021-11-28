const mongoose = require('mongoose');


const newsSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true
    },
    description:{
        type:String,
        trim:true,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    newsImage:{
        type:Buffer
    }
},{timestamps:true})

const News = mongoose.model('News',newsSchema)

module.exports = News;