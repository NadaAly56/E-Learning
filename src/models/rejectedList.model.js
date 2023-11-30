const mongoose = require("mongoose");

const rejectedListSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: "student",
    required: true,
  },

  roundId: {
    type: mongoose.Types.ObjectId,
    ref: "round",
    required: true,
  },
  rejectedReason: {
    type: String,
    required: true,
    min: [25, "reason is too short"],
  },
  responsibleOfRejected: {
    type: mongoose.Types.ObjectId,
    ref: "admin",
    required: true,
  },
  isDeleted : {
    type : Boolean,
    default: false,
  }
});

const rejectedListModel = mongoose.model("rejectedList", rejectedListSchema);
module.exports = rejectedListModel;