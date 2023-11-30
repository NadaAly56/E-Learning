const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: [3,'name should be minimum 3 letters'] ,
        maxlength: [20,'name should be maximum 3 letters'],
        trim: true,
        lowercase: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (v)=>/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: 'Email should be XXX@XX.XX'
        }
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
    image:{
        type: String,
        required: true,
    },
    role:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "role"
    }
});
const adminModel = mongoose.model('admin',adminSchema);
module.exports = adminModel;