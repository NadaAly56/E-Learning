const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "name should be minimum 3 letters"],
    maxlength: [20, "name should be maximum 3 letters"],
    trim: true,
    lowercase: true,
  },
  permissions: {
    type: Array,
    required: true,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
});
const roleModel = mongoose.model("role", roleSchema);
module.exports = roleModel;