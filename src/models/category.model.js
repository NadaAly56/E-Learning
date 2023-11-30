const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    minlength: [3,'name should be minimum 3 letters'] ,
    maxlength: [30,'name should be maximum 3 letters'],
    trim: true,
  },
  isActive:{
    type: Boolean,
    required: true,
  },
  isDelete:{
    type: Boolean,
    default: false
  },
});
const categoryModel = mongoose.model('category',categorySchema);
module.exports = categoryModel;