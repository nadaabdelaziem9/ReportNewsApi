const jwt = require('jsonwebtoken');
const Report = require('../models/report')

const auth = async(req,res,next)=>{
    try{
        const token =req.header('Authorization').replace('Bearer ','');

        
        const decode = jwt.verify(token, 'news-application');

    

        const report = await Report.findOne({_id:decode._id,'tokens.token':token})
        if(!report){
            throw new Error();
        }
        req.report = report;
        req.token = token;
        next();
    }
    catch(e){
        res.status(401).send({error:'Please authenticate'})
    }
}

module.exports = auth