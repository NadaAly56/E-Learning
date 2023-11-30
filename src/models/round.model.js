const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema({
  days: {
    type: Number,
    require: [true, "must have number of days"],
  },
  qualifyingPeriod: {
    type: String,
    enum: ["morning", "evening"],
    require: true,
    trim:true
  },
});
const rateSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'students'  
  },
  rate: {
    type: Number,
    enum: [1, 2, 3, 4, 5]
  },
});

const rateInstructorSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'students'
  },
  rate: {
    type: Number,
    enum: [1, 2, 3, 4, 5]
  },
});

const roundSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: [true, "Round must have a name"],
      minlength: [3, "Name should be a minimum of 3 letters"],
      maxlength: [20, "Name should be a maximum of 20 letters"],
    },
    startDate: {
      type: Date,
      required: [true, "Round should have start Date "],
    },
    endDate: {
      type: Date,
      required: [true, "Round should have end Date "],
    },
    actualStartDate: {
      type: Date,
      

      require: function() {
        return this.start;
      },
    },
    actualEndDate: {
      type: Date,
      require: function() {
        return this.finish;
      },
    },
    duration: {
      type: String,
      required: [true, "Round must have a duration"],
    },
    start: {
      type: Boolean,
      default: false,
    }, 
    finish: {
      type: Boolean,
      default: false,
    },
    isClose: {
      type: Boolean,
      default: false,
    },
    closeDate: {
      type: Date,
      required: function() {
        return this.isClose;
      },
    },
    closeReason: {
      type: String,
      min: [3, " close Reason should be a minimum of 3 letters"],
      required: function() {
        return this.isClose;
      },
    },
    responsibleOfClose: {
      type: mongoose.Types.ObjectId,
      ref: "admin",
      required: function() {
        return this.isClose;
      },
    },
    period: periodSchema,
    minimumStudents: {
      type: Number,
      require: true,
    },
    maximumStudents: {
      type: Number,
      require: true,
    },
    registrationStart: {
      type: Date,
      required: [true, "Round should have registration Start  Date "],
    },
    registrationEnd: {
      type: Date,
      required: [true, "Round should have registration End  Date "],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      require: true,
    }, 
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "subCategory",
      require: true,
    }, 
    program: {
      type: mongoose.Types.ObjectId,
      ref: "program",
      require: true,
    },
    docRequired: {
      type: Array,
      require: true,
    }, 
    roundEligibility: {
      type: Array,
      require: true,
    }, 
    registrationList: [
      {
        type: mongoose.Types.ObjectId,
        ref: "student",
        
      }
    ],
    instructor: {
      type: mongoose.Types.ObjectId,
      ref: "instructor",
      required: true,
    }, 
    createBy: {
      type: mongoose.Types.ObjectId,
      ref: "admin",
    }, 
    isAvailable: {
      type: Boolean,
      require: true,
    },
    isPublish: {
      type: Boolean,
      require: true,
    },
    responsibleOfIsPublish: 
      {
        type: mongoose.Types.ObjectId,
        ref: "admin",
      }, 
    rate: [rateSchema] ,
    rateInstructor: [rateInstructorSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    responsibleOfIsDeleted: {
      type: mongoose.Types.ObjectId,
      ref: "admin",
    }, 
  },
  {
    timestamps: true,
  }
);

const roundModel = mongoose.model("round", roundSchema);
module.exports = roundModel;