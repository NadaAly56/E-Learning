const joi = require('joi')

class Student {

   static addStudent = joi.object({
        name: joi.string().required().min(3).max(25),
        fullName: joi.string().required().min(8).max(70),
        email: joi.string().lowercase().required().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        password: joi.string().required().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        
        gender: joi.string().required().valid('male', 'female'),
        nationalID: joi.string().required().pattern(/^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$/),
        
        
            city: joi.string().required(),
            country: joi.string().required(),
     
        
        dateOfBirth: joi.date().required(),
        phone: joi.string().required().pattern(/^01[0125][0-9]{8}$/),
        university: joi.string().required(),
        faculty: joi.string().required(),
        isGraduated: joi.boolean().required(),
        academicYear: joi.number().min(1).max(5).when('isGraduated', {is: false, then: joi.required()}),
        graduationGrade: joi.string().when('isGraduated', {is:true, then:joi.required()}),
        graduationYear: joi.date().when('isGraduated', {is:true, then:joi.required()}),
        isFinalYear: joi.boolean().when('isGraduated', {is:false, then:joi.required()}),
        militaryStatue: joi.string().when('gender', {is: 'male',
        then:
            joi.string().when('isGraduated', {is:true, then: joi.string().required().valid('complete', 'exemption' ,'postponed')})}),
            photo: joi.string(),
            certificate: joi.any(),
        
    })

    static actionsStudent = joi.object({

        isSuspended : joi.boolean(),
        responsibleOfSuspend : joi.string().when('isSuspended' , {is :true , then : joi.required()}),
        reasonOfSuspend : joi.string().when('isSuspended' , {is :true , then : joi.string().min(25).required()}),
        nationalID: joi.string().pattern(/^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$/),
        isDeleted : joi.boolean(),
        reasonOfDeleted : joi.string().when('isDeleted' , {is :true , then : joi.string().min(25).required()}),
        responsibleOfDeleted : joi.string().when('isDeleted' , {is :true , then : joi.string().required()}),
    })

    static updateStudent = joi.object({
        name: joi.string().min(3).max(20),
        fullName: joi.string().min(8).max(70),
        address: joi.object({
            city: joi.string(),
            country: joi.string()
        }),
        gender: joi.string().valid('male', 'female'),
        dateOfBirth: joi.date(),
        nationalIDCard: joi.string(),
        phone: joi.string().pattern(/^01[0125][0-9]{8}$/),
        university: joi.string(),
        faculty: joi.string(),
        isGraduated: joi.boolean(),
        academicYear: joi.number().min(1).max(5).when('isGraduated', {is: false, then: joi.required()}),
        graduationGrade: joi.string().when('isGraduated', {is:true, then:joi.required()}),
        graduationYear: joi.date().when('isGraduated', {is:true, then:joi.required()}),
        isFinalYear: joi.boolean().when('isGraduated', {is:false, then:joi.required()}),
        militaryStatue: joi.string().when('gender', {is: 'male',
        then:
            joi.string().when('isGraduated', {is:true, then: joi.string().required().valid('complete', 'exemption' ,'postponed')})}),
        
    })
}

module.exports = Student






