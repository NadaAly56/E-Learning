const acceptedListModel = require("../models/acceptedList.model");
const _ = require('lodash');
const AppError = require("../utils/appError.js")
const catchAsyncError = require("../middlewares/catchError.js")
const waitingListModel = require("../models/waitingList.model.js");
const studentModel = require("../models/student.model.js");
const roundModel = require("../models/round.model");


class AcceptedListController {


  /**
   *  @desc     Get All accepted students
   *  @route    /api/acceptedList?name=name
   *  @method   GET
   *  @access   public
   */
  static  getAllAcceptedList = catchAsyncError(async function(req, res, next) {
    
      const name =  req.query.name;
      const query = name ? { name: name.trim() } : {};
      // const pageSize = req.query.pageSize ||  20
      // const pageNumber = req.query.pageNumber || 1

      const acceptedList = await acceptedListModel.find(query)
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
      .populate('responsibleOfIsDeleted','name -_id')
      
      if(!acceptedList) return next(new AppError("No acceptedList found ", 404))
    
      // const results = await acceptedListModel.find().count()
      // const pagesTotal  = results>pageSize? (results/pageSize) : 1

      return res.status(200).json(
      {
          // results,
          requestResults: acceptedList.length,
          // pageNumber,
          // pageSize,
          // pagesTotal ,
          acceptedList
      })

  })

  /**
   *  @desc     Get All accepted students
   *  @route    /api/acceptedList/:id
   *  @method   GET
   *  @access   public
   */
  static  getAcceptedListbyIdRound = catchAsyncError(async function(req, res, next) {
    
      const RoundId = req.params.id
      // const pageSize = req.query.pageSize ||  20
      // const pageNumber = req.query.pageNumber || 1

      const acceptedList = await acceptedListModel.find({roundId: RoundId})
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
      .populate('responsibleOfIsDeleted','name -_id')
      
      if(!acceptedList) return next(new AppError("No acceptedList found ", 404))
    
      // const results = await acceptedListModel.find().count()
      // const pagesTotal  = results>pageSize? (results/pageSize) : 1

      return res.status(200).json(
      {
          // results,
          // requestResults: acceptedList.length,
          // pageNumber,
          // pageSize,
          // pagesTotal ,
          acceptedList
      })

  })

  /**
   *  @desc     Add new student to accepted list
   *  @route    /api/acceptedList
   *  @method   POST
   *  @access   public
   */
  static  addAcceptedList = catchAsyncError(async function(req, res, next) {

      const body = _.pick(req.body, ["name","studentId", "roundId"]);

      if (!body) return next(new AppError("Missing data", 400))

      const student = await studentModel.findById(body.studentId)
      const round = await roundModel.findById(body.roundId)

      let indexStudent =  round.registrationList.indexOf(body.studentId)

      student.roundsLog.push(body.roundId)
      round.registrationList.splice(indexStudent,1)

      await student.save()
      await round.save()
      
      const acceptedList = await acceptedListModel.create(body);
      return res.status(201).json(acceptedList);

  })

  /**
   * @description : updates accepted list
   *  @route    /api/acceptedList/:id
   *  @method   PUT
   *  @access   public
   */
  static updateAcceptedList = catchAsyncError(async function(req, res, next) {

      const body = _.pick(req.body, [
        "student",
        "round",
        "score",
        "isDeleted",
        "responsibleOfIsDeleted"
      ]);

      const id = req.params.id;

      const acceptedList = await acceptedListModel.findById(id);
      if (!acceptedList) return next(new AppError("Accepted student not found", 404))

      const acceptedListUpdated = await acceptedListModel.findByIdAndUpdate(
        id,body,
        { new: true }
      );

      return res.status(200).json(acceptedListUpdated);
  })

  /**
   * @description : updates accepted list
   *  @route    /api/acceptedList/setScore?
   *  @method   PUT
   *  @access   public
   */
  static setScore = catchAsyncError(async function(req, res, next) {

    const body = _.pick(req.body, [
      "studentId",
      "roundId",
      "score",
    ]);

      console.log(body);

      const acceptedList = await acceptedListModel.findOne({ studentId : body.studentId , roundId : body.roundId });
      if (!acceptedList) return next(new AppError("Accepted student not found", 404))

      acceptedList.score = body.score
      await acceptedList.save()

      return res.status(200).json({message : 'Successfully set Score ' });
  })


    /**
   *  @desc     Add a waiting list students to accepted list when a matched round opens
   *  @route    /api/admin/acceptedPreviousWaitingList
   *  @method   POST
   *  @access   private (Admin)
   */
    static  addFromWaitingList = catchAsyncError(async function(req, res, next) {

      const body = _.pick(req.body , ['roundId','studentId'])

      if(!body) return next(new AppError('Missing Data', 400))

      const student = await studentModel.findById(body.studentId)
      console.log(student);
      const acceptedStudent = {
        name: student.name,
        studentId: body.studentId,
        roundId: body.roundId
      }
      const acceptStudent = await acceptedListModel.create(acceptedStudent);

      if(acceptStudent){
          await waitingListModel.deleteOne({ studentId:body.studentId})
          const student = await studentModel.findById(body.studentId)

          student.roundsLog.push(body.roundId)
          student.save()
          // round.registrationList.splice(indexStudent,1)

      }
      else{
        return next(new AppError('Something Error', 400))
      }

      const result = await acceptedListModel.find(acceptStudent).populate({
        path:"studentId",
        select:"name -_id"
      })
      .populate({
        path:"roundId",
        select:"name -_id"
      })
      return res.status(200).json(result)
  })


  /**
   * @description Get All waiting list Students
   * @route /api/acceptedList
   * @method GET
   * @access public
   */
  static deleteAcceptedList= catchAsyncError(async function(req, res, next) {
    // const pageSize = req.query.pageSize || 20
    // const pageNumber = req.query.pageNumber || 1

      const body = _.pick(req.body, ["studentId", "roundId"]);
      if (!body) return next(new AppError("Missing required data", 400)) 

      const acceptedList = await acceptedListModel.deleteOne(body)
      // .skip((pageNumber -1 ) * pageSize)
      // .limit(pageSize)
      if(!acceptedList) return next(new AppError("not found waitingList", 404))
        
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
        acceptedList,
      });

  })

}

module.exports = AcceptedListController;