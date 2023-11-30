const mongoose = require('mongoose');


const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});
const filesSchema = new mongoose.Schema({
  nationalIDCard: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  certificate: {
    type : String,
    required: function() {
      return this.isGraduated;
    }
  },
});


const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, ' name should be minimum 3 letters'],
        maxLength: [25, ' name should be maximum 25 letters']
    },
    fullName: {
        type: String,
        required: true,
        minLength: [8, 'full name should be minimum 8 letters'],
        maxLength: [70, 'full name should be maximum 70 letters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (v)=>/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: 'Email should be XXX@XX.XX'
        }
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female']
    },
    nationalID: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: v =>
          /^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$/.test(v),
        message: 'National Id is invalid'
      }
    },
    address: addressSchema,
    dateOfBirth: {
      type: Date,
      required: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: v => /^01[0125][0-9]{8}$/gm.test(v),
        message: 'Mobile number is not valid'
      }
    },
    university: {
      type: String,
      required: true
    },
    faculty: {
      type: String,
      required: true
    },
    academicYear: {
        type: Number,
        required:  function(){
            return !this.isGraduated
        },
        min: 1,
        max: 5
    },
    isGraduated: {
      type: Boolean,
      required: true
    },
    graduationGrade: {
      type: String,
      enum: ['fair', 'good', 'very good', 'excellent'],
      required: function() {
        return this.isGraduated;
      }
    },
    graduationYear: {
      type: Date,
      required: function() {
        return this.isGraduated;
      }
    },
    isFinalYear: {
      type: Boolean,
      required: function() {
        return !this.isGraduated;
      }
    },
    militaryStatue: {
        type: String,
        required: function(){
            if(this.gender === 'male'){
            return this.isGraduated
            }
            else return false
        },
        enum : ['complete', 'exemption' ,'postponed']      
    },
    files: filesSchema,
    roundsLog: {    
        type: [mongoose.Types.ObjectId],
        ref: 'round',
    },
    userSuspended: {
      responsibleOfSuspend: {
      type: mongoose.Types.ObjectId,
      ref: 'admin',
      required: function(){
        return this.isSuspended
      }
    },
    isSuspended: {
      type: Boolean,
      default: false
    },
    reasonOfSuspend: {
      type: String,
      required: function(){
        return this.isSuspended
      },
      minLength: [25, 'reason is too short']
    }},
    isEmployed: {
      isWorked: {
        type: Boolean,
        default: false
      },
      companyName: {
        type: String,
        required: function(){
          return this.isWorked
        }
      }
    },
    userDeleted: {
      responsibleOfDeleted: {
        type: mongoose.Types.ObjectId,
        ref: 'admin',
        required: function(){
          return this.isDeleted
        }
      },
      isDeleted: {
        type: Boolean,
        default: false
      },
      reasonOfDeleted: {
        type: String,
        required: function(){
          return this.isDeleted
        },
        minLength: [25, 'reason is too short']
      }
    }
  },
  {
    timestamps: true
  }
);

const studentModel = mongoose.model('student', studentSchema);
module.exports = studentModel;