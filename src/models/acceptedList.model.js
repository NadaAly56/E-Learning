const mongoose = require("mongoose");

const acceptedListSchema = new mongoose.Schema({
  name :{
    type : String,
    required : true,
    lowercase : true,
    trim : true,
  },
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: "student", 
  },
  roundId: {
    type: mongoose.Types.ObjectId,
    ref: "round", 
  },
  score: {
    type: Number,
    min: 0, 
    max: 100,
    default : undefined,
  },
  isDeleted : {
    type: Boolean,
    default: false,
},
  responsibleOfIsDeleted : {
    type: mongoose.Types.ObjectId,
    ref: "admin",
    required: function() {
        return this.isDeleted;
      },
},
});

const acceptedListModel = mongoose.model(
  "acceptedList",
  acceptedListSchema
);

module.exports = acceptedListModel;
