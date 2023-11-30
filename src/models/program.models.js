const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true,
        lowercase: true,
        minlength: [3, 'name is very short'],
        trim: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref : "category",
    },  
    subCategory: {
        type: mongoose.Types.ObjectId,
        ref:  "subCategory",
        required: true,
    }, 
    level : {
        type: String,
        required: true,
    }, 
    skillsRequired : {
        type: String,
        required: true,
    },
    skillsProgram: {
        type: String,
        required: true,
    },
        description: {
            type: String,
            required: true,
        },
        image : {
            type: String,
            required : true,
        }, 
        certificate: {
            type: String,
        },
    programEligibility : {
        type: String,
        required: true,
    }, 
    roundLog :{
        type: [mongoose.Types.ObjectId],
        ref: "round",
    }, 
    instructorsLog :{
        type: [mongoose.Types.ObjectId],
        ref: "instructor",
    }, 
    createBy : {
        type: mongoose.Types.ObjectId,
        ref: "admin",
    }, 
    isAvailable :  {
        type: Boolean,
        required: true,
    
    },
    isPublish :  {
        type: Boolean,
        required: true,
    },
    responsibleOfIsPublish :  {
        type: mongoose.Types.ObjectId,
        ref: "admin",
        
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

const programModel = mongoose.model("program", programSchema);
module.exports = programModel;
