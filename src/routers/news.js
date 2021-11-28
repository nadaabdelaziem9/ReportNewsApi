const express = require('express');
const router = new express.Router();
const News = require('../models/news');
const auth = require('../middleware/auth');
const multer = require('multer');


router.post('/news',auth,async(req,res)=>{
    try{
        const news = new News({...req.body,owner:req.report._id});
        await news.save();
        res.status(200).send(news);
    }
    catch(e){
        res.status(400).send("e"+e);
    }
})

router.get('/news/:id',auth, async(req,res)=>{
    try{
        const _id = req.params.id;
        const news = await News.findOne({_id,owner:req.report._id});
        if(!news){
            res.status(404).send('unable to find news')
        }
        res.status(200).send(news);
    }
    catch(e){
        res.status(400).send("e" +e);
    }
});

router.get('/news',auth,async(req,res)=>{
    try{
        await req.report.populate("news");
        res.status(200).send(req.report.news)
    }
    catch(e){
        res.status(500).send(e)
    }
});

router.patch('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id;
        const news = await News.findOneAndUpdate({_id,owner:req.report._id},req.body);
        if(!news){
            res.status(404).send('unable to find news')
        }
        await news.save();
        res.status(200).send(news);
    }
    catch(e){
        res.status(400).send(e)
    }
});

router.delete('/news/:id', auth, async(req,res)=>{
    try{
        const _id = req.params.id;
        const news = await News.findOneAndDelete({_id,owner:req.report._id});
        if(!news){
            res.status(404).send('unable to find news')
        }
        res.status(200).send(news);
    }
    catch(e){
        res.status(400).send(e);
    }
});

const uploads = multer({
    limits:{fileSize:1000000},

    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)){
            cb(new Error('You must upload image'))
        }
        cb(null,true);
    }
})

router.post('/news/image/:id',auth, uploads.single('image'),async(req,res)=>{
    try{
        const _id = req.params.id;
        const news = await News.findById(_id);
        if(!news){
            res.status(404).send('unable to find news')
        }
        news.newsImage = req.file.buffer;
        await news.save();
       res.send();
    }
    catch(e){
        res.status(500).send("e"+e);
    }
})

module.exports = router
