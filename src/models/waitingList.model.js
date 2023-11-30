const mongoose = require("mongoose");

const waitingListSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "student",
    },
    roundId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "round",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const waitingListModel = mongoose.model("waitingList", waitingListSchema);

module.exports = waitingListModel;