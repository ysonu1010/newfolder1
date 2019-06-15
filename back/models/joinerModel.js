const mongoose =require('mongoose');
const joinerSchema= mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    event: {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'event'
    },
   name:{type:String,required:true},
   email:{type:String,required:true,unique:true},
   mobile:{type:Number,required:true}
});
module.exports = mongoose.model('joiner',joinerSchema);