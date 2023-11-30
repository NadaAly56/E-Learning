const mongoose = require("mongoose");


const instructorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Instructor must have a name"],
      minlength: [3, "Name should be a minimum of 3 letters"],
      maxlength: [20, "Name should be a maximum of 20 letters"],
      lowercase: true,
    },
    fullName: {
      type: String,
      required: [true, "Instructor must have a name"],
      minlength: [8, "Name should be a minimum of 8 letters"],
      maxlength: [70, "Name should be a maximum of 70 letters"],
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: [true, "Please set a unique email"],
      validate: {
        validator: (v) =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
        message: "Email should be XXX@XX.XX",
      },
    },
    nationalID: {
      type: String,
      unique: true,
      required: [true, "Instructor should have an ID"],
      validate: {
        validator: (v) =>
          /^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$/.test(
            v
          ),
        message: "National ID is invalid",
      },
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Please provide a mobile number"],
      validate: {
        validator: (v) => /^01[0125][0-9]{8}$/gm.test(v),
        message: "Mobile number is not valid",
      },
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Instructor should have a Date Of Birth"],
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    round: [
      {
        type: mongoose.Types.ObjectId,
        ref: "round",
      },
    ],
    roundsLog: [
      {
        type: mongoose.Types.ObjectId,
        ref: "round",
      },
    ],
    // skills: {
    //   type: Array,
    //   required: true,
    // },
    rate: {
      type: [Number],
      enum: [1 , 2, 3, 4, 5]
    },
    isFreelancing: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    userDeleted: {
      responsibleOfDeleted: {
        type: mongoose.Types.ObjectId,
        ref: 'admin',
        required: function () {
          return this.isDeleted;
        }
      },
      isDeleted: {
        type: Boolean,
        default: false
      },
      reasonOfDeleted: {
        type: String,
        required: function () {
          return this.isDeleted;
        },
        minLength: [25, 'reason is too short']
      }
    },
    specialization:{
      type: mongoose.Types.ObjectId,
      ref: 'subCategory',
      required: true,
    },
    bio: {
      type: String,
      default: "No description",
    },
    nationalIDCard: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
      default: "default_Avatar.jpg",
    },
    cv: {
      type: String,
    },
    // certificates: [String],
    country: {
      type: String,
      required: [true, "You should specify a country"],
    },
    city: {
      type: String,
      required: [true, "You should specify a city"],
    },
    userSuspended: {
      responsibleOfSuspend: {
        type: mongoose.Types.ObjectId,
        ref: 'admin',
        required: function () {
          return this.isSuspended;
        }
      },
      isSuspended: {
        type: Boolean,
        default: false
      },
      reasonOfSuspend: {
        type: String,
        required: function () {
          return this.isSuspended;
        },
        minLength: [25, 'reason is too short']
      }
    }
  },
  {
    timestamps: true,
  }
);

const instructorModel = mongoose.model("instructor", instructorSchema);

module.exports = instructorModel;
