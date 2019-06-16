const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userModel =require('../models/userModel');
router.get('/',function(req,res){
    userModel.find()
    .exec()
    .then(ldr=>{
        res.json(ldr).status(200);
    })
 });
router.post('/',function(req,res){


const newUser = new userModel({
    _id:new mongoose.Types.ObjectId(),
    name:req.body.name,
    email : req.body.email,
    password:req.body.password
});

userModel.find({email:req.body.email})
.exec()
.then(ldr =>{
    if(ldr.length>0){
      res.send("user already exist").status(400);
    }
    else{
        newUser.save(function(err,newEntry){
            if(err){
                console.log(err);
                res.json(err).status(400);
            }
            else {
                res.status(201);
            }
        });
        res.send('user added').status(200);
    }
})
.catch(err =>{
    console.log(err);
});


});
router.get('/login', function(req,res){
    userModel.findOne({email: req.query.email, password:req.query.password})
    .exec()
    .then(data=>{
        // req.session.user=data;
        res.json(data).status(200);
    })
    .catch(err=>{
        console.log(err);
    });
});
router.get('/:userId',function(req,res){
    const id = req.params.userId;
    userModel.findById(id)
    .exec()
    .then(ldr=>{
        res.json(ldr).status(200);
    })
});



router.delete('/:userId',function(req,res){
    const id=req.params.userID;
    userModel.deleteOne({_id:id})
    .exec()
    .then(data=>{
        res.json(data).status(200);
    })
});
module.exports = router;