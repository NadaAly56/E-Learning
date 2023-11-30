const waitingListModel = require("../models/waitingList.model");
const _ = require("lodash");
const AppError = require("../utils/appError.js")
const catchAsyncError = require("../middlewares/catchError.js")
const studentModel = require("../models/student.model");
const roundModel = require("../models/round.model");



class WaitingListController {
  /**
   * @description Get All waiting list Students
   * @route /api/waitingList
   * @method GET
   * @access public
   */
  static getAllWaitingList = catchAsyncError(async function(req, res, next) {
    // const pageSize = req.query.pageSize || 20
    // const pageNumber = req.query.pageNumber || 1

      const waitingList = await waitingListModel.find()
        // .skip((pageNumber -1 ) * pageSize)
        // .limit(pageSize)
        .populate("student", "name -_id")
        .populate('round')
        .populate({
          path: 'round',
          populate: {
            path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
            select: "name -_id",
          }
        })

      if(!waitingList) return next(new AppError("not found waitingList", 404))

      // const results = await waitingListModel.find().count()
      // const pagesTotal  = results>pageSize? (results/pageSize) : 1

      return res.status(200).json({
        // results,
        requestResults: waitingList.length,
        // pageNumber,
        // pageSize,
        // pagesTotal ,
        waitingList,
      });

  })


  /**
   * @description Get All waiting list Students
   * @route /api/waitingList
   * @method GET
   * @access public
   */
  static getWaitingListsByIdRound = catchAsyncError(async function(req, res, next) {
    // const pageSize = req.query.pageSize || 20
    // const pageNumber = req.query.pageNumber || 1
    const roundId = req.params.id
      const waitingList = await waitingListModel.find({roundId : roundId})
        // .skip((pageNumber -1 ) * pageSize)
        // .limit(pageSize)
        .populate("studentId", "name ")
        .populate('roundId')
        .populate({
          path: 'roundId',
          populate: {
            path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
            select: "name ",
          }
        })

      if(!waitingList) return next(new AppError("not found waitingList", 404))

      // const results = await waitingListModel.find().count()
      // const pagesTotal  = results>pageSize? (results/pageSize) : 1

      return res.status(200).json({
        // results,
        // requestResults: waitingList.length,
        // pageNumber,
        // pageSize,
        // pagesTotal ,
        waitingList,
      });

  })

  /**
   * @description Get All waiting list Students
   * @route /api/waitingList
   * @method GET
   * @access public
   */
  static deleteWaitingLists= catchAsyncError(async function(req, res, next) {
    // const pageSize = req.query.pageSize || 20
    // const pageNumber = req.query.pageNumber || 1

      const body = _.pick(req.body, ["studentId", "roundId"]);
      console.log(body);
      if (!body) return next(new AppError("Missing required data", 400)) 

      const waitingList = await waitingListModel.deleteOne({roundId : body.roundId , studentId: body.studentId})
        // .skip((pageNumber -1 ) * pageSize)
        // .limit(pageSize)
        

      if(!waitingList) return next(new AppError("not found waitingList", 404))

      const student = await studentModel.findById(body.studentId)

      let indexRound = student.roundsLog.indexOf(body.roundId)
      await student.roundsLog.splice(indexRound, 1)

      await student.save()
      // const results = await waitingListModel.find().count()
      // const pagesTotal  = results>pageSize? (results/pageSize) : 1

      return res.status(200).json({
        // results,
        // requestResults: waitingList.length,
        // pageNumber,
        // pageSize,
        // pagesTotal ,
        waitingList,
      });

  })

  /**
   * @description Add a new student to the waiting list
   * @route /api/waitingList/
   * @method POST
   * @access public
   */
  static addWaitingList = catchAsyncError(async function(req, res, next) {
    
      const body = _.pick(req.body, ["studentId", "roundId"]);
      if (!body) return next(new AppError("Missing required data", 400))

      // Check if a document with the same student and round ID exists
      const existingWaiting = await waitingListModel.findOne({
        student: body.student,
        round: body.round,
      });

      if (existingWaiting) return next(new AppError("Document with the same student and round ID already exists", 409))

      const waitingList = await waitingListModel.create(body);

      let round = await roundModel.findById(body.roundId)

      let indexStudent =  round.registrationList.indexOf(body.studentId)
      round.registrationList.splice(indexStudent,1)

      await round.save()

      return res.status(201).json(waitingList);

  })

  /**
 * @description update Waiting List
 * @route /api/waitingList/:id
 * @method PUT
 * @access Private
 */
  static updateWaitingList = catchAsyncError(async function(req, res, next) {
      const { id } = req.params;

      const body = _.pick(req.body, ["studentId", "roundID", "isDeleted"]);
      if (!body) return next(new AppError("Missing required data", 400))

      const waitingList = await waitingListModel.findById(id);
      if (!waitingList) return next(new AppError("not found", 404))

      const waitingListUpdated = await waitingListModel.findByIdAndUpdate(id, body, { new: true })      
        .populate('student')
        .populate('round')
        .populate({
          path: 'round',
          populate: {
            path: 'category subCategory program responsibleOfClose responsibleOfIsDeleted',
            select: "name -_id",
          }
        })
      return res.status(200).json(waitingListUpdated);
  })
}

module.exports = WaitingListController;
