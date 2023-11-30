const mongoose = require("mongoose")
const bcrypt= require("bcryptjs")
const catchAsyncError = require("../middlewares/catchError.js")
const studentModel = require("../models/student.model.js")
const _ = require('lodash')
const sendEmail = require('../emails/user.email.js')
const AppError = require("../utils/appError.js")
const userModel = require("../models/user.model")
const xssAttack = require("../utils/xssAttack")
const waitingListModel = require("../models/waitingList.model");
const rejectedListModel = require("../models/rejectedList.model");
const roundModel = require("../models/round.model");
const acceptedListModel = require("../models/acceptedList.model");






class StudentController {

/**
   *  @description Register New Student
   *  @route /api/student
   *  @method POST
   *  @access public
*/
    static  signUp  = catchAsyncError(async function(req, res, next) {


        const fields = [
            'name', 'fullName', 'email',
            'password' , 'gender','nationalID',
            'dateOfBirth','studentSuspended',
            'phone','university','faculty',
            'isGraduated','academicYear','graduationGrade',
            'graduationYear','isFinalYear','militaryStatue',
            
        ]

        const { city, country, bio } = req.body
        const address = {city, country}

        const {nationalIDCard, photo, certificate} = req.files
        

        let body = _.pick(req.body ,fields)
        const redirectLink  = req.header('redirectLink')
        
        const existingStudent = await studentModel.findOne(
            {
                $or: [{email: body.email}, {nationalID: body.nationalID}, {phone: body.phone}]
            });
            if (existingStudent) return next(new AppError("student has already existing", 409))

            const existingUser = await userModel.findOne({email : body.email})
            if (existingUser) return next(new AppError('User has already existing'),409)
        

        body.password = await bcrypt.hash(body.password , Number(process.env.SALT))

        
        body = xssAttack(body)

        

        if(!nationalIDCard) return next(new AppError("Missing national ID Card ", 400))
        if(!photo) return next(new AppError("Missing photo  ", 400))
        if(!certificate) return next(new AppError("Missing certificate  ", 400))
        const files = {
            nationalIDCard: nationalIDCard[0].filename,
            photo: photo[0].filename,
            certificate: certificate[0].filename,
        }
        const newStudent= await studentModel.create({...body, address, files})

        const user ={_id: newStudent._id ,name : body.name ,email: body.email, password: body.password , type: 'student'}
        await userModel.create(user);


        sendEmail({email:body.email, redirectLink, subject: "Email Confirmation"})
        res.status(201).json({message:'Signed up successfully'})

    })


/**
   *  @description Get Student By ID 
   *  @route /api/student/:id
   *  @method GET
   *  @access private ( Admin Only )
*/
    static getStudentById = catchAsyncError(async function(req, res, next) {

        
        const id = req.params.id;
        if (!id) return next(new AppError("Id is missing", 400))
        
        const student = await studentModel.findById(id)
        .populate('roundsLog')
        .populate({
            path: 'roundsLog',
            select :' name startDate endDate duration period category subCategory program instructor start finish',
            populate: {
              path: 'category subCategory program instructor',
              select: "name",
            }
        })
        if(!student) return next(new AppError('Student not found', 404))

        return res.status(200).json(student)

    })




/**
   *  @description Actions Student By ID  ( isSuspended - isDeleted - nationalID )
   *  @route /api/student/actions/:id
   *  @method PUT
   *  @access private (Admin only)
*/
    static actionsStudent = catchAsyncError(async function(req, res, next) {

        const id = req.params.id;
        if (!id) return next(new AppError("Id is missing'", 400))

        let student = await studentModel.findById(id)
        if (!student) return next(new AppError("Student is not found'", 404))


        const fields =  [
            'isDeleted','responsibleOfDeleted','reasonOfDeleted' ,
            'nationalID', 'userDeleted' ,'userSuspended',
            'isSuspended' ,'responsibleOfSuspend' , 'reasonOfSuspend'
            ]
        
        const body = _.pick(req.body ,fields )

        if (!body) return next(new AppError("Data is missing", 400))

        if(body.isSuspended == false){
            student.userSuspended.isSuspended =  false;
            student.userSuspended.reasonOfSuspend =  undefined;
            student.userSuspended.responsibleOfDeleted =  undefined;
        }

        if(body.isDeleted == false){
            student.userDeleted.isDeleted =  false;
            student.userDeleted.responsibleOfDeleted =  undefined;
            student.userDeleted.reasonOfDeleted =  undefined;
        }
        
        student.userSuspended.isSuspended =  body.isSuspended;
        student.userSuspended.reasonOfSuspend =  body.reasonOfSuspend;
        student.userSuspended.responsibleOfDeleted =  body.responsibleOfDeleted;


        student.userDeleted.isDeleted =  body.isDeleted;
        student.userDeleted.responsibleOfDeleted =  body.responsibleOfDeleted;
        student.userDeleted.reasonOfDeleted =  body.reasonOfDeleted;
          
        await student.save();


        return res.status(200).json({ message : 'student is updated' , student})
    })



/**
   *  @description Update Student By ID  
   *  @route /api/student/:id
   *  @method PUT
   *  @access private (Admin and Student) 
*/

    static updateStudent = catchAsyncError(async function(req, res, next) {

        const id = req.params.id;
        if (!id) return next(new AppError("Id is missing'", 400))

        const fields = [
                        'name', 'fullName','country','city',
                        'dateOfBirth','phone','isGraduated',
                        'academicYear','graduationGrade',
                        'graduationYear','isFinalYear','faculty',
                        'university','militaryStatue',
                        ]

        const body = _.pick(req.body ,fields)

        if (!body) return next(new AppError("data is missing'", 400))
        
        const student = await studentModel.findByIdAndUpdate(id,body,{new : true});
        await userModel.findByIdAndUpdate(id,{
            $set : {
                name :body.name
            }
        })
        return res.status(200).json({ message : 'student is updated' , student})
    })


/**
   *  @description Get all Students Registered Or Get Student by Name , Full Name
   *  @route /api/student  || ( /api/student?name=nameStudent || /api/student?fullName=fullNameStudent )
   *  @method GET  
   *  @access private ( Admin Only )
*/
    static getStudents = catchAsyncError(async function(req, res, next) {

        // const pageSize = req.query.pageSize ||  20
        // const pageNumber = req.query.pageNumber || 1
        const name = req.query.name 
        const query = name ? { name: name.trim().toLowerCase() } : {};

        

            const students = await studentModel.find(query)
            // .populate('roundsLog')
            // .skip((pageNumber -1 ) * pageSize)
            // .limit(pageSize)

            if(!students) return res.status(404).json({message : 'Student not found'})
            // const results = await studentModel.find().count()
            // const pagesTotal  = results>pageSize? (results/pageSize) : 1

            return res.status(200).json(
            {
                // results,
                requestResults: students.length,
                // pageNumber,
                // pageSize,
                // pagesTotal ,
                students
            })

    })



/**
   *  @description Get information for this Student
   *  @route /api/student/profile/info
   *  @method GET  
   *  @access private ( user )
*/
    static studentInfo = catchAsyncError(async function(req, res, next) {

        const student = req.user
        const studentInfo = await studentModel.findById( student.id)
        .populate('roundsLog')
        .populate({
            path: 'roundsLog',
            select :'-_id name startDate endDate duration period category subCategory program instructor start finish',
            populate: {
              path: 'category subCategory program instructor',
              select: "name -_id",
            }
        })
        if(!studentInfo) return next(new AppError("Student is Not Found'", 400))

        return res.json(studentInfo)
    })


/**
   *  @description Get Waiting List for this Student
   *  @route /api/student/profile/waiting
   *  @method GET  
   *  @access private ( user )
*/
    static studentWaiting = catchAsyncError(async function(req, res, next) {

        const student = req.user
        const waiting = await waitingListModel.find({student : student.id})
        .populate({
            path : 'round',
            populate : {
                path : 'category subCategory program',
                select : 'name -_id',
            }
        })

        return res.json({result: waiting.length, waiting})

    })


/**
   *  @description Get Rejected List for this Student
   *  @route /api/student/profile/rejected
   *  @method GET  
   *  @access private ( user )
*/
    static studentRejected = catchAsyncError(async function(req, res, next) {

        const student = req.user
        const rejected = await rejectedListModel.find({student : student.id})
        .populate({
            path : 'round',
            populate : {
                path : 'category subCategory program',
                select : 'name -_id',
            }
        })

        return res.json({result: rejected.length, rejected})

    })


/**
   *  @description Get Rejected List for this Student
   *  @route /api/student/profile/registration
   *  @method GET  
   *  @access private ( user )
*/
    static studentRegistration = catchAsyncError(async function(req, res, next) {

        const student = req.user
        const registration= await roundModel.find({registrationList : student.id})
        .populate({
            path : 'category subCategory program',
            select : 'name -_id',
        })

        return res.json({result: registration.length, registration})

    })



   /**
 * @description Get accepted List for this student
 * @route /api/student/profile/accepted
 * @method GET
 * @access public
 */
   static studentAccepted = catchAsyncError(async function (req, res, next) {

    const student = req.user
    const studentAcceptedList = await acceptedListModel.find({ student: student.id })
    .select('-student -responsibleOfIsDeleted -isDeleted')
    .populate({
        path: 'round',
        select: 'name startDate endDate actualStartDate actualEndDate start finish duration period category subCategory program instructor rate score -_id',
        populate: [
            { path: 'category', select: 'name -_id' },
            { path: 'subCategory', select: 'name -_id' },
            { path: 'program', select: 'name -_id' },
            { path: 'instructor', select: 'name -_id' },
        ],
    });

    return res.status(200).json({result: studentAcceptedList.length, studentAcceptedList});

});









}

module.exports = StudentController