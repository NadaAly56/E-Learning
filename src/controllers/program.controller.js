const programModel = require("../models/program.models");
const _ = require("lodash");
const AppError = require("../utils/appError.js")
const catchAsyncError = require("../middlewares/catchError.js")
const fs = require('fs');
const path = require('path');
class ProgramController {
  /**
   * Get Programs
   * @route /api/program
   * @method GET
   * @access public
   */
  static  getPrograms = catchAsyncError(async function(req, res, next){

      // const pageSize = req.query.pageSize ||  20
      // const pageNumber = req.query.pageNumber || 1
      const name = req.query.name;
      const query = name ? { name: name.trim().toLowerCase() } : {};

      const programs = await programModel.find(query)
      .populate({
        path : 'category subCategory roundLog instructorsLog responsibleOfIsPublish createBy responsibleOfIsDeleted',
        select: 'name '
      })
      // .skip((pageNumber -1 ) * pageSize)
      // .limit(pageSize)

      if (!programs) return next(new AppError("No programs found ", 404))
      // const results = await programModel.find().count()

      // const pagesTotal  = results>pageSize? (results/pageSize) : 1

      return res.status(200).json(
        { 
          // results,
          requestResults: programs.length,
          // pageNumber,
          // pageSize,
          // pagesTotal ,
          programs
        });

  })

  /**
   * Get Program By ID
   * @route /api/program/:id
   * @method GET
   * @access public
   */
  static getProgramById = catchAsyncError(async function(req, res, next){

      const program = await programModel.findById(req.params.id)
      .populate({
        path : 'category subCategory roundLog instructorsLog responsibleOfIsPublish createBy responsibleOfIsDeleted',
        // select: 'name '
      })
      .populate({
        path : 'roundLog',
        populate: {
          path: 'instructor',
          select: "name",
        }
      })

      if (!program) return next(new AppError("Program not found", 404))

      return res.status(200).json(program);

  })

  /**
   * Add New Program
   * @route /api/program
   * @method POST
   * @access public
   */
  static addProgram = catchAsyncError(async function(req, res, next) {

      const body = _.pick(req.body, [
        "name",
        "category",
        "subCategory",
        "level",
        "skillsRequired",
        "skillsProgram",
        "programEligibility",
        "createBy",
        "isAvailable",
        "description",
        "isPublish",
        "responsibleOfIsPublish",
        "image",
        "certificate"
      ]);
  
      if (!body)  return next(new AppError("Missing Data", 400))

      const existingProgram = await programModel.findOne({ name: body.name ,category : body.category})
          .populate('category', 'name')
          .populate('subCategory', 'name')
          .exec();
  
        if (existingProgram) return next(new AppError("Program already exists concentrate", 409))
        const {image} = req.files
        const {certificate} = req.files

        if(!image) return next(new AppError("Missing Image", 400));
        if(!certificate) return next(new AppError("Missing Certificate", 400));

        body.image = await image[0].filename
        body.certificate = await certificate[0].filename
        
        const program = await programModel.create(body);
        return res.status(201).json(
          {
            message : 'Successfully created new program',
            program
          }
        );
      

  })

  /**
   * Update Program
   * @route /api/program/:id
   * @method PUT
   * @access public
   */
  static updateProgram = catchAsyncError(async function(req, res, next) {
      const body = _.pick(req.body, [
        "name",
        "category",
        "subCategory",
        "level",
        "skillsRequired",
        "skillsProgram",
        "programEligibility",
        "createBy",
        "isAvailable",
        "isPublish",
        "responsibleOfIsPublish",
        "isDeleted",
        "responsibleOfIsDeleted",
        "image",
        "certificate"
      ]);

      if (!body) return next(new AppError("Missing required fields", 400))
      
      const id = req.params.id;

      const program = await programModel.findById(id);
      if (!program) return next(new AppError("Program not found", 404))

      const {image} = req.files
      const {certificate} = req.files

      if(image){
        if(fs.existsSync(path.join(__dirname, `../../uploads/${program.image}`))){
          fs.unlinkSync(path.join(__dirname, `../../uploads/${program.image}`))
        }
        body.image = await image[0].filename
      }
      if(certificate){
        if(fs.existsSync(path.join(__dirname, `../../uploads/${program.certificate}`))){
          fs.unlinkSync(path.join(__dirname, `../../uploads/${program.certificate}`))
        }
        body.certificate = await certificate[0].filename
      }
      const updatedProgram = await programModel.findByIdAndUpdate(id,body,{ new: true });
      return res.status(200).json({message : 'Successfully updated program'});
  })
}

module.exports = ProgramController;
