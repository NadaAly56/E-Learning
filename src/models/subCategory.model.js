const mongoose = require("mongoose");
const subCategorySchema = new mongoose.Schema({
  name:{
    type: String,
    lowercase: true,
    minlength: [3,'name should be minimum 3 letters'] ,
    maxlength: [30,'name should be maximum 3 letters'],
    trim: true,
  },
  category:{
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "category"
  },
  image : {
    type : String,
    required: true,
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
const subCategoryModel = mongoose.model('subCategory',subCategorySchema);
module.exports = subCategoryModel;