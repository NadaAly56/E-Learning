const mongoose = require("mongoose");


const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    lowercase : true,
    required: true,
  },
  subject:{
    type: String,
    lowercase : true,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
},{
    timestamps: true
}
);


const roleModel = mongoose.model("contact", contactSchema);
module.exports = roleModel;