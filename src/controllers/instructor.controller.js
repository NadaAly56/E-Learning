const _ = require("lodash");
const instructorModel = require("../models/instructor.model");
const AppError = require("../utils/appError.js")
const catchAsyncError = require("../middlewares/catchError.js")
const bcrypt= require("bcryptjs")
const userModel = require("../models/user.model")
const sendEmail = require('../emails/user.email.js')
const fs = require('fs');
const path = require('path');

class InstructorController {
  /**
   *  @description Register New Instructor
   *  @route /api/v1/instructor
   *  @method POST
   *  @access public
   */
  static addInstructor = catchAsyncError(async function(req, res, next){
    const redirectLink  = req.header('redirectLink')

      let body = _.pick(req.body, [
        "dateOfBirth",
        "nationalID",
        "fullName",
        "password",
        "skills",
        "gender",
        "phone",
        "email",
        "name",
        "bio",
        'country',
        'city',
        'nationalIDCard',
        'photo',
        'cv',
        'isFreelancing',
        'specialization'
      ]);
      if (!body) return next(new AppError("Missing Data", 400))

      body.password = await bcrypt.hash(body.password , Number(process.env.SALT))
      
      const existingInstructor = await instructorModel.findOne({fullName : body.fullName , nationalID : body.nationalID})
      if (existingInstructor) return next(new AppError('Instructor has already existing'),409)

      const existingUser = await userModel.findOne({email : body.email})
    if (existingUser) return next(new AppError('User has already existing'),409)

      const {nationalIDCard, photo, cv} = req.files


      const address = {
        country:body.country ,
        city:body.city
      }
      if(!nationalIDCard) return next(new AppError("Missing national ID Card ", 400));
      if(!photo) return next(new AppError("Missing photo ", 400));
      if(!cv) return next(new AppError("Missing cv ", 400));

      body.nationalIDCard = await nationalIDCard[0].filename,
      body.photo = await photo[0].filename ,
      body.cv = await cv[0].filename || undefined;
      // body.certificates = await certificates?.map(file_=>file_.filename) || undefined;

      const newInstructor = await instructorModel.create({...body,address});      
      const user ={_id :newInstructor._id, name : body.name ,email: body.email, password: body.password , type: 'instructor'}
      await userModel.create(user);

      sendEmail({email:body.email, redirectLink, subject: "Email Confirmation"})
      return res.status(201).json({
        message : 'Successfully added Instructor',
        newInstructor
      });
  })

  /**
   * @description Get all instructors
   * @route /api/instructors
   * @method GET
   * @access public
   */
  static getAllInstructors = catchAsyncError(async function(req, res, next) {
      const { name } = req.query;
      const query = name ? { name: name.trim() } : {};
      // const pageSize = req.query.pageSize ||  20
      // const pageNumber = req.query.pageNumber || 1

      const instructors = await instructorModel.find(query)
        // .skip((pageNumber -1 ) * pageSize)
        // .limit(pageSize)
        .populate('round')
        // .populate({
        //   path: 'round',
        //   populate: {
        //     path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
        //     select: "name -_id",
        //   }
        // })
        .populate('roundsLog')
        // .populate({
        //   path: 'roundsLog',
        //   populate: {
        //     path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
        //     select: "name -_id",
        //   }
        // })
        // .populate('userSuspended.responsibleOfSuspend')
        // .populate('userDeleted.responsibleOfDeleted')
        .populate('specialization','name')



      if (!instructors) return next(new AppError("No instructors found", 404))
      // const results = await instructorModel.find().count()
      // const pagesTotal  = results>pageSize? (results/pageSize) : 1

      return res.status(200).json({
        // results,
        requestResults: instructors.length,
        // pageNumber,
        // pageSize,
        // pagesTotal ,
        instructors,
      });

  })

  /**
   * @description Get instructor by ID
   * @route /api/instructors/:id
   * @method GET
   * @access public
   */
  static getInstructorById = catchAsyncError(async function(req, res, next) {
      const { id } = req.params;

      const instructor = await instructorModel.findById(id)
        .populate('round')
        .populate({
          path: 'round',
          populate: {
            path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
            select: "name -_id",
          }
        })
        .populate('roundsLog')
        .populate({
          path: 'roundsLog',
          populate: {
            path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
            select: "name -_id",
          }
        })
        .populate('userSuspended.responsibleOfSuspend')
        .populate('userDeleted.responsibleOfDeleted')
        // .populate({
        //   path: 'round',
        //   select: 'name rate category subCategory program actualStartDate',
        // })
        .populate('specialization','name ');

      if (!instructor) return next(new AppError("Instructor not found", 404))

      return res.status(200).json( instructor );
  })


  /**
   * @description Update an instructor
   * @route /api/instructor/:id
   * @method put
   * @access public
   */
  static updateInstructor =  catchAsyncError(async function(req, res, next) {
      const { id } = req.params;
      const allowedFields = [
        "phone",
        "bio",
        'country',
        'city',
        'photo',
        'cv',
        'name',
      ];

      const instructor = await instructorModel.findById(id);
      if (!instructor) return next(new AppError("Instructor not found", 404))
      
      const {photo, cv } = req.files 

      const files = {
        photo: req.files.photo? photo[0].filename: instructor.files.photo,
        cv: (req.files.cv? cv[0].filename : instructor.files.cv),
        // certificates: req.files.certificates? certificates?.map(file_=>file_.filename) : instructor.files.certificates,
        bio: req.files.bio? req.body.bio : instructor.files.bio
    }

      const body = _.pick(req.body, allowedFields);
      if (!body) return next(new AppError("Missed Data", 400))


// delete the old files
        if (instructor.files.photo && photo) {
          if(fs.existsSync(path.join(__dirname, `../../uploads/${instructor.files.photo}`))){
            fs.unlinkSync(path.join(__dirname, `../../uploads/${instructor.files.photo}`))
          }
          body.photo =  await photo[0].filename
        };
        if (instructor.files.cv && cv) {
          if(fs.existsSync(path.join(__dirname, `../../uploads/${instructor.files.cv}`))){
            fs.unlinkSync(path.join(__dirname, `../../uploads/${instructor.files.cv}`))
          }
          body.cv =  await cv[0].filename
        };

      const instructorUpdated = await instructorModel.findByIdAndUpdate(id, {body, files}, { new: true })
        .populate('round')
        .populate({
          path: 'round',
          populate: {
            path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
            select: "name -_id",
          }
        })
        .populate('roundsLog')
        .populate({
          path: 'roundsLog',
          populate: {
            path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
            select: "name -_id",
          }
        })
        .populate('userSuspended.responsibleOfSuspend')
        .populate('userDeleted.responsibleOfDeleted');


      return res.status(200).json({
        message : 'Successfully updated instructor',
        instructorUpdated
      });
  })

  /**
 * @description Update admin instructor by ID
 * @route /api/instructors/actions/:id
 * @method PUT
 * @access private (admin only)
 */
  static adminUpdateInstructor = catchAsyncError(async function(req, res, next){
      const { id } = req.params;

      const allowedFields = [
        'name',
        'fullName',
        'email',
        'nationalID',
        'phone',
        'dateOfBirth',
        'gender',
        'round',
        'roundsLog',
        'skills',
        'isFreelancing',
        'isAvailable',
        'isSuspended',
        'responsibleOfDeleted',
        'reasonOfDeleted',
        // 'files',
        'address',
        'isDeleted',
        'responsibleOfSuspend',
        'reasonOfSuspend',
        'specialization',
        'userSuspended',
        'userDeleted'
      ];

      let body = _.pick(req.body, allowedFields);
      if (!body) return next(new AppError("Missed Data", 400))

      const instructor = await instructorModel.findById(id);
      if (!instructor) return next(new AppError("Instructor not found", 404))

      body.userSuspended={
        isSuspended :body.isSuspended,
        responsibleOfSuspend :body.responsibleOfSuspend,
        reasonOfSuspend :body.reasonOfSuspend,
      }

      body.userDeleted={
        isDeleted :body.isDeleted,
        responsibleOfDeleted :body.responsibleOfDeleted,
        reasonOfDeleted :body.reasonOfDeleted,
      }



      if (body.userSuspended?.isSuspended == false) {
        body.userSuspended.responsibleOfSuspend = undefined;
        body.userSuspended.reasonOfSuspend = undefined;
      }
      if (body.userDeleted?.isDeleted == false) {
        body.userDeleted.responsibleOfDeleted = undefined;
        body.userDeleted.reasonOfDeleted = undefined;
      }

      let  cv = req.files.cv
      let nationalIDCard = req.files.nationalIDCard
      let  photo = req.files.photo

    

        if(nationalIDCard){
          if(fs.existsSync(path.join(__dirname, `../../uploads/${instructor.nationalIDCard}`))){
            fs.unlinkSync(path.join(__dirname, `../../uploads/${instructor.nationalIDCard}`))
          }
          body.nationalIDCard = await nationalIDCard[0].filename
        }
        if(photo){
          if(fs.existsSync(path.join(__dirname, `../../uploads/${instructor.photo}`))){
            fs.unlinkSync(path.join(__dirname, `../../uploads/${instructor.photo}`))
          }
          body.photo = await photo[0].filename
        }
        if(cv){
          if(fs.existsSync(path.join(__dirname, `../../uploads/${instructor.cv}`))){
            fs.unlinkSync(path.join(__dirname, `../../uploads/${instructor.cv}`))
          }
          body.cv = await cv[0].filename
        }

      // }
      const instructorUpdated = await instructorModel.findByIdAndUpdate(id, body, { new: true })
        .populate('round')
        .populate({
          path: 'round',
          populate: {
            path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
            select: "name -_id",
          }
        })
        .populate('roundsLog')
        .populate({
          path: 'roundsLog',
          populate: {
            path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
            select: "name -_id",
          }
        })
        .populate('userSuspended.responsibleOfSuspend')
        .populate('userDeleted.responsibleOfDeleted')
        .populate('specialization','name -_id');

      return res.status(200).json({
        message : 'Successfully updated instructor',
        instructorUpdated
      });

  })

  /**
 * @description Get information for this instructor
 * @route /api/instructors/profile/info
 * @method GET
 * @access private (instructor only)
 */

  static instructorInfo = catchAsyncError(async function(req, res, next){

    const instructor = req.user
    const instructorInfo = await instructorModel.findById( instructor.id)
    .populate('round')
    .populate({
      path: 'round',
      populate: {
        path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
        select: "name -_id",
      }
    })
    .populate('roundsLog')
    .populate({
      path: 'roundsLog',
      populate: {
        path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
        select: "name -_id",
      }
    })

    .populate('userSuspended.responsibleOfSuspend')
    .populate('userDeleted.responsibleOfDeleted')
    .populate({
      path: 'roundsLog',
      select: 'name rate category subCategory program actualStartDate actualEndDate',
      match: { finish: true }})
    
    .populate({
      path: 'round',
      select: 'name rate category subCategory program actualStartDate',
      match: { finish: false }
    })
    .populate('specialization','name -_id');
    if(!instructorInfo) return next(new AppError("Instructor is Not Found'", 400))

    return res.json(instructorInfo)
    
  })



}

module.exports = InstructorController;

