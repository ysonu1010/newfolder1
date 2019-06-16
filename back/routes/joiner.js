const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const joinerModel = require('../models/joinerModel');
const event = require('../models/eventModel');
router.get('/',function(req,res){
    joinerModel.find()
    .exec()
    .then(joiners=>{
        // if(!req.session.user){
        //     return res.status(404).send("Unauthorized access")
        // }
        res.json(joiners).status(200);
    })
    .catch(err =>{
        res.json(err).status(201);
    })
 });
 router.post('/',function(req,res){
    const newJoiner = new joinerModel({
        _id:new mongoose.Types.ObjectId(),
        event:req.body.event,
        name:req.body.name,
        email : req.body.email,
        mobile: req.body.mobile
    });

    joinerModel.find({email:req.body.email})
    .exec()
    .then(ldr =>{
        if(ldr.length>0){
        res.send("joiner already exist").status(400);
        }
        else{
            newJoiner.save();
            res.send("joiner added").status(200);
        }
    })
    .catch(err =>{
        console.log(err);
    });
});

router.get('/:eventId',function(req,res){
    const id= req.params.eventId;
    joinerModel.find({event: id})
    .exec()
    .then(jr=>{
        // if(!req.session.user){
        //     return res.status(404).send("Unauthorized access")
        // }
        res.json(jr).status(200);
    })
    .catch(err =>{
        res.json(err).status(201);
    })
});
module.exports = router;