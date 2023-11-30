const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['event', 'news'],
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "admin",
  },
  title: {
    type: String,
    required: true,
    minlength: [3,'title should be minimum 3 letters'] ,
    trim: true,
  },
  subTitle: {
    type: String,
    required: true,
    minlength: [3,'subTitle should be minimum 3 letters'] ,
    trim: true,
  },
  desc:{
    type: String,
    required: true,
    minlength: [10,'desc should be minimum 10 letters'] ,
    trim: true,
  },
  imageCover: {
    type: String,
    required: true,
  },
  isPublished:{
    type: Boolean,
    required: true,
  },
  isDelete:{
    type: Boolean,
    default: false
  },
},{
  timestamps: true
}
);
const newsModel = mongoose.model('news',newsSchema);
module.exports = newsModel;