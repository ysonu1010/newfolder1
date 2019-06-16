const express = require('express');
const morgan  = require('morgan');
const parser = require('body-parser');
const user = require('./routes/user');
const event = require('./routes/event');
const joiner = require('./routes/joiner');
const multer = require('multer');
const request = require('request');
const pug = require('pug');
const _ = require('lodash');
const path = require('path');
const app =express();
const port = 4000;
// var session = require('express-session');


const {Donor} = require('./models/donor')
const {initializePayment, verifyPayment} = require('./config/paystack')(request);





app.use(express.static('public2'));
const mongoose =require('mongoose');
mongoose.connect("mongodb+srv://dhananjay:loveunepal@cluster0-ih6b6.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true },function(err){
if(err){
  console.log('not connected');
  console.log(err);
}else{
  console.log('atlas connected');
}
});

var cons = require('consolidate');
// view engine setup
app.engine('html', cons.swig)
app.set('./', path.join(__dirname, './'));
app.set('view engine', 'html');


app.use(morgan('dev'));
app.use(parser.json());
app.use(parser.urlencoded({extended:false}));
// app.use(session({secret:"hfbfkjdkndvn" , resave:false, saveUninitialized:true}));
app.use(express.static(path.join(__dirname, 'publics/')));
app.set('view engine', pug);
app.use('*',function(req,res,next){
res.set('Access-Control-Allow-origin','*');
res.set('Access-Control-Allow-Headers','content-type');
res.set('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS');
next();
});
app.post('/paystack/pay', (req, res) => {
  const form = _.pick(req.body,['amount','email','full_name']);
  form.metadata = {
      full_name : form.full_name
  }
  form.amount *= 100;
  
  initializePayment(form, (error, body)=>{
      if(error){
          //handle errors
          console.log(error);
          return res.redirect('/error')
          return;
      }
      response = JSON.parse(body);
      console.log(response);
      res.redirect(response.data.authorization_url)
  });
});


app.get('/paystack/callback', (req,res) => {
  const ref = req.query.reference;
  verifyPayment(ref, (error,body)=>{
      if(error){
          //handle errors appropriately
          console.log(error)
          return res.redirect('/error');
      }
      response = JSON.parse(body);        

      const data = _.at(response.data, ['reference', 'amount','customer.email', 'metadata.full_name']);

      [reference, amount, email, full_name] =  data;
      
      newDonor = {reference, amount, email, full_name}

      const donor = new Donor(newDonor)

      donor.save().then((donor)=>{
          if(!donor){
              return res.redirect('/error');6
          }
          res.redirect('/receipt/'+donor._id);
      }).catch((e)=>{
          res.redirect('/error');
      })
  })
});

app.get('/receipt/:id', (req, res)=>{
  const id = req.params.id;
  Donor.findById(id).then((donor)=>{
      if(!donor){
          //handle error when the donor is not found
          res.redirect('/error')
      }
      res.render('success.pug',{donor});
  }).catch((e)=>{
      res.redirect('/error')
  })
})

app.get('/error', (req, res)=>{
  res.render('error.pug');
})



app.use('/user',user);
app.use('/event',event);
app.use('/joiner',joiner);
 

app.get('/',function(req,res){
  res.send("success").status(200);
});


app.listen(port,function(){
  console.log(`server listenng on ${port}`);
})