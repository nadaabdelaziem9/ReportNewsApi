const express = require('express');
const router = new express.Router();
const Report = require('../models/report');
const auth = require('../middleware/auth');
const multer = require('multer');


router.post('/report', async(req,res)=>{
    try{
        const report = new Report(req.body);
        const token = await report.generateToken();
        await report.save();
        res.status(200).send({report,token});
    }
    catch(e){
        res.status(400).send("e" + e)
    }
})


router.post('/report/login',async(req,res)=>{
    try{
        const report = await Report.findByCredentials(req.body.email,req.body.password);
        const token = await report.generateToken();
        res.status(200).send({report,token});
    }
    catch(e){
        res.status(400).send("e" +e);
    }
})


router.get('/report',auth, async(req,res)=>{
    try{
        const report = await Report.find({});
        res.status(200).send(report)
    }
    catch(e){
        res.status(500).send("e" + e)
    }
})


router.get('/report/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id;
        const report = await Report.findById(_id);
        if(!report){
            res.status(404).send('unable to find report');
        }
        res.status(200).send(report);
    }
    catch(e){
        res.status(400).send(e);
    }
})


router.get('/profile',auth,async(req,res)=>{
    res.send(req.report);
})


router.patch('/report/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id;
        const updates = Object.keys(req.body);
        const report = await Report.findById(_id);

        if(!report){
            res.status(404).send('unable to find report')
        }
        updates.forEach(update => report[update] = req.body[update]);
        await report.save();
        res.status(200).send(report);
    }
    catch(e){
        res.status(400).send(e);
    }
})


router.delete('/report/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id;
        const report = await Report.findByIdAndDelete(_id);
        if(!report){
            res.status(404).send('unable to find report')
        }
        res.status(200).send(report);
    }
    catch(e){
        res.status(500).send(e);
    }
})


router.delete('/logout', auth,async(req,res)=>{
    try{
        req.report.tokens = req.report.tokens.filter(el =>{
            return el.token !== req.token
        })
        await req.report.save();
        res.status(200).send('logout successfully')
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.delete('/logoutAll',auth, async(req,res)=>{
    try{
        req.report.tokens = [];
        await req.report.save();
        res.status(200).send('logout from all devices successfully')
    }
    catch(e){
        res.status(500).send(e); 
    }
})

const uploads = multer({
    limits:{fileSize:1000000},

    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)){
            cb(new Error('You must upload image'))
        }
        cb(null,true);
    }
})

router.post('/profile/image',auth,uploads.single('image'),async(req,res)=>{
    try{
        req.report.image = req.file.buffer;
        await req.report.save();
       res.send();
    }
    catch(e){
        res.status(500).send(e);
    }
})

module.exports = router