const _ = require("lodash");
const rejectedListModel = require("../models/rejectedList.model");
const AppError = require("../utils/appError.js")
const catchAsyncError = require("../middlewares/catchError.js")
const roundModel = require("../models/round.model");



class RejectedList {
  /**
   *  @description Add New Rejected Student
   *  @route /api/rejectedList
   *  @method POST
   *  @access public
   */
  static addRejectedList = catchAsyncError(async function(req, res, next) {
      const requiredFields = [
        "studentId",
        "roundId",
        "rejectedReason",
        "responsibleOfRejected",
      ];
      const body = _.pick(req.body, requiredFields);

      if (!body) return next(new AppError("Missing Data", 400))

      // Check if a document with the same student and round ID exists
      const existingRejected = await rejectedListModel.findOne({
        student: body.student,
        round: body.round,
      });

      if (existingRejected) return next(new AppError("Document with the same student and round ID already exists.", 409))

      const newRejected = await rejectedListModel.create(body);
      let round = await roundModel.findById(body.roundId)

      let indexStudent =  round.registrationList.indexOf(body.studentId)
      round.registrationList.splice(indexStudent,1)

      await round.save()
      return res.status(201).json({message : 'Student successfully added to Rejected '});
  })

  /**
   * @description get All Rejected List Students
   * @route /api/rejectedList
   * @method GET
   * @access public
   */
  static getAllRejectedList = catchAsyncError(async function(req, res, next)  {

    // const pageSize = req.query.pageSize ||  20
    // const pageNumber = req.query.pageNumber || 1

      const rejectedList = await rejectedListModel.find()
        .populate("studentId")
        .populate('roundId')
        .populate({
          path: 'roundId',
          populate: {
            path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
            select: "name -_id",
          }
        })
        .populate('responsibleOfRejected','name -_id');

        if(!rejectedList) return next(new AppError("Not found rejectedList", 404))

        // const results = await rejectedListModel.find().count()
        // const pagesTotal  = results>pageSize? (results/pageSize) : 1


      return res.status(200).json({
          // results,
          requestResults: rejectedList.length,
          // pageNumber,
          // pageSize,
          // pagesTotal ,
          rejectedList
      });

  })

    /**
   *  @desc     Get All accepted students
   *  @route    /api/rejectedList/:id
   *  @method   GET
   *  @access   public
   */
    static  getRejectedListbyIdRound = catchAsyncError(async function(req, res, next) {
    
      const RoundId = req.params.id
      // const pageSize = req.query.pageSize ||  20
      // const pageNumber = req.query.pageNumber || 1

      const rejectedList = await rejectedListModel.find({roundId: RoundId})
      // .skip((pageNumber -1 ) * pageSize)
      // .limit(pageSize)
      .populate('studentId')
      .populate('roundId')
      .populate({
        path :'roundId',
        populate : {
          path: 'category subCategory program',
          select: "name -_id",
        }
      })
      .populate('responsibleOfRejected','name -_id')
      
      if(!rejectedList) return next(new AppError("No acceptedList found ", 404))
    
      // const results = await acceptedListModel.find().count()
      // const pagesTotal  = results>pageSize? (results/pageSize) : 1

      return res.status(200).json(
      {
          // results,
          // requestResults: acceptedList.length,
          // pageNumber,
          // pageSize,
          // pagesTotal ,
          rejectedList
      })

  })



   /**
   * @description Get All waiting list Students
   * @route /api/rejectedList
   * @method GET
   * @access public
   */
   static deleteRejectedList= catchAsyncError(async function(req, res, next) {
    // const pageSize = req.query.pageSize || 20
    // const pageNumber = req.query.pageNumber || 1

      const body = _.pick(req.body, ["studentId", "roundId"]);
      if (!body) return next(new AppError("Missing required data", 400)) 

      const rejectedList = await rejectedListModel.deleteOne(body)
        // .skip((pageNumber -1 ) * pageSize)
        // .limit(pageSize)
        

      if(!rejectedList) return next(new AppError("not found waitingList", 404))

      // const results = await waitingListModel.find().count()
      // const pagesTotal  = results>pageSize? (results/pageSize) : 1

      return res.status(200).json({
        // results,
        // requestResults: waitingList.length,
        // pageNumber,
        // pageSize,
        // pagesTotal ,
        rejectedList,
      });

  })
}

module.exports = RejectedList;