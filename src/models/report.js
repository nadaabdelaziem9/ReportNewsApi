const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const reportSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:5
    },
    age:{
        type:Number,
        default:'30',
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    phone:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isMobilePhone(value ,['ar-EG'])){
                throw new Error('please enter a valid mobile number')
            }
        }
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    image:{
        type:Buffer
    }
},{timestamps:true});


reportSchema.virtual('news',{
    ref:'News',
    localField:'_id',
    foreignField:'owner'
})


reportSchema.pre('save', async function(next){
    const report = this

    if(report.isModified('password')){
        report.password = await bcrypt.hash(report.password,8)
    }
    next();
});


reportSchema.statics.findByCredentials = async(email,password) => {
    const report = await Report.findOne({email:email});
    if(!report){
        throw new Error('Unable to find email,Please sign up');
    }

    const isMatch = await bcrypt.compare(password,report.password)
    if(!isMatch){
        throw new Error('incorrect password')
    }

    return report;
}


reportSchema.methods.generateToken = async function(){
    const report = this
    const token = jwt.sign({_id:report._id.toString()},'news-application')
    report.tokens = report.tokens.concat({token});
    await report.save();
    return token;
}


reportSchema.methods.toJSON = function (){
   const report = this;
   const reportObject = report.toObject();
   delete reportObject.password;
   delete reportObject.tokens;
   return reportObject;
}

const Report = mongoose.model('Report', reportSchema);

module.exports = Report