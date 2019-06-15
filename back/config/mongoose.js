const mongoose =require('mongoose');
mongoose.connect("mongodb+srv://dhananjay:loveunepal@cluster0-ih6b6.mongodb.net/test?retryWrites=true&w=majority",function(err){
if(err){
  console.log('not connected');
  console.log(err);
}else{
  console.log('atlas connected');
}
});
module.exports = {mongoose}