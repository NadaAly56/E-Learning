const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    mail: {
      type: String,
      required: true,
      lowercase: true,
    
      
    },
    phoneNumbers:[ {
      type: String,
      required: true,
      
      
    }],
    socialMedia: {
        type: {
            facebook : String,
            instagram: String,
            linkedin: String,
            telegram: String,
        },
        required: true,
        
    },
    carousel:[ {
        type: {
            image : String,
            text : String,
        },
        required: true,
        
    }],
    address:{
        type: [String],
        required: true,
        
    },
    mission:{
        type: [String],
        required: true,
        
    },
    vision:{
        type: [String],
        required: true,
        
    },
  },
  { timestamps: true }
);

const settingModel = mongoose.model("setting", settingSchema);

module.exports = settingModel;