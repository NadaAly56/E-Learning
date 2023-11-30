const _ = require("lodash");
const AppError = require("../utils/appError.js")
const catchAsyncError = require("../middlewares/catchError.js");
const roundModel = require("../models/round.model");
const acceptedListModel = require("../models/acceptedList.model");
const waitingListModel = require("../models/waitingList.model.js");
const studentModel = require("../models/student.model.js");
const programModel = require("../models/program.models");
const instructorModel = require("../models/instructor.model");



class RoundController {
  /**
   * @description Add a new round.
   * @route /api/round
   * @method POST
   * @access public
   */
  static  addRound = catchAsyncError(async function(req, res, next){

      const requiredFields = [
        "name",
        "startDate",
        "endDate",
        "duration",
        "category",
        "subCategory",
        "program",
        "period",
        "minimumStudents",
        "maximumStudents",
        "registrationStart",
        "registrationEnd",
        'instructor',
        'isPublish',
        "roundEligibility",
        'docRequired',
        "responsibleOfIsPublish",
        "createBy",
        "isAvailable"
      ];
      const body = _.pick(req.body,requiredFields)

      if (!body) return next(new AppError("Missing required data", 400))


      const existingRound = await roundModel.findOne({
        name: body.name,
        subCategory: body.subCategory,
      });

      if (existingRound) return next(new AppError("Round with the same program, category, and subCategory already exists", 409))

      const newRound = await roundModel.create(body);

      const addRoundToProgram = await programModel.findById(body.program)
      addRoundToProgram.roundLog.push(newRound._id)
      addRoundToProgram.instructorsLog.push(body.instructor)
      addRoundToProgram.save()

      const addRoundToInstructor = await instructorModel.findById(body.instructor)
      addRoundToInstructor.round.push(newRound._id)
      addRoundToInstructor.roundsLog.push(newRound._id)
      addRoundToInstructor.save()

      return res.status(201).json({message : `Round : ${body.name} added successfully`});

})

  /**
     *  @description get all Rounds 
     *  @route /api/round
     *  @method GET 
     *  @access public
     */
  static getAllRounds = catchAsyncError(async function(req, res, next){


      const  {name} = req.query;
      const query = name ? { name: name} : {};
      const  subCategory  = req.query.subCategory;
      // const pageSize = req.query.pageSize ||  20
      // const pageNumber = req.query.pageNumber || 1

      let rounds
      let data = await roundModel.find(query)
      // .skip((pageNumber -1 ) * pageSize)
      // .limit(pageSize)
      .populate({
        path : 'category subCategory program registrationList instructor createBy responsibleOfIsPublish',
        select : 'name -_id'
      })
      .then((res)=>{
        if(subCategory){
          rounds= res.filter(ele=>{
            return (ele.subCategory?.name == subCategory )
          })
        }else{
          return rounds = res
        }
       })
       .catch((err)=>{
        return next(new AppError(err, 400))
       })

      // const results = await roundModel.find().count()
      // const pagesTotal  = results>pageSize? (results/pageSize) : 1

      return res.status(200).json(
        {
          // results,
          requestResults: rounds.length,
          // pageNumber,
          // pageSize,
          // pagesTotal ,
          rounds
        });
})



  /**
   * @description Update a round by ID.
   * @route /api/round/:id
   * @method PUT
   * @access public
   */
  static  updateRound = catchAsyncError(async function(req, res, next) {

      const roundId = req.params.id;
      const allowedFields = [
        "name",
        "startDate",
        "endDate",
        "duration",
        "period",
        "minimumStudents",
        "maximumStudents",
        "registrationStart",
        "registrationEnd",
        "instructor",
        "isPublish",
        "isAvailable",
        "isDeleted",
        "program",
        "category",
        "subCategory",
        "responsibleOfClose",
        "closeReason",
        "isClose",
        "start",
        "finish",
        "responsibleOfIsDeleted",
        "roundEligibility",
        "actualStartDate",
        "actualEndDate"
      ];

      const body = _.pick(req.body, allowedFields);
      console.log(body);
      if (!body) return next(new AppError("Missing required data", 400))
      const round = await roundModel.findById(roundId);

      if (!round) return next(new AppError("No rounds found", 404))

      if(body.finish === true && round.start === false){
        return next(new AppError("you can't finish this round before starting", 400))
      } 
      
      if(body.rate !== undefined && body.finish !== true && round.finish === false){
        return next(new AppError("you can't rate this round before finishing", 400))
      } 
      // remove the round from the round at instructor has finished round 
      if(body.finish === true ) {
        const removeRound = await instructorModel.findById(round.instructor.toString());
        const index = removeRound.round.indexOf(roundId);
        removeRound.round.splice(index, 1);
        removeRound.save();   
      }
      const roundUpdated = await roundModel.findByIdAndUpdate(roundId, body,{new: true});

      return res.status(200).json({message: "Round updated successfully"});
  })
  
  /**
   * @description Get a round by ID.
   * @route /api/round/:id
   * @method GET
   * @access public
   */
  static getRoundByID = catchAsyncError(async function(req, res, next) {
    const roundId = req.params.id;
    
      const round = await roundModel.findById(roundId)
      .populate({
        path : 'category subCategory program registrationList instructor createBy responsibleOfIsPublish',
        select : 'name '
      })
  
      if (!round) return next(new AppError("Round not found", 404));
      return res.status(200).json(round)
    
  });
  /**
   * @description Update a round rate by ID.
   * @route /api/round/rate/:id
   * @method PUT
   * @access public
   */
  static addRoundRate = catchAsyncError(async function(req, res, next) {
    const roundId = req.params.id;
    const { roundRateValue , instructorRateValue} = req.body;
  
    const studentId = req.user.id;
      const round = await roundModel.findById(roundId);
  
      if (!round) return next(new AppError("Round not found", 404));


      if (!round.finish) return next(new AppError("Round is not finished yet", 400));


      const isStudentInRound = await acceptedListModel.exists({
        studentId: studentId,
        roundId: roundId,
      });

      if (!isStudentInRound) return next(new AppError("Student is not in this round", 404));

  
      const existingRate = round.rate.find((r) => r.id.toString() === studentId);
  
      if (existingRate) return next(new AppError("Student has already rated for this round", 409))

      round.rate.push({ id: studentId, rate: roundRateValue });
      round.rateInstructor.push({ id: studentId, rate: instructorRateValue });
  
      const updatedRound = await round.save();
  
      res.status(200).json({ message: 'Rate updated', round: updatedRound });
    
  });
  
  

  static getRateRound = catchAsyncError(async function (req, res, next) {
    const { id } = req.params;
  
    const round = await roundModel.findById(id);
           
    if (!round) return next(new AppError("Round not found", 404))

  
    if (round.rate.length === 0) {
     
      return res.status(200).json(0);
    }
  
    const rates = round.rate.map(rate => rate.rate);
  
  
    const totalRate = rates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  
    const avgRate = Math.round(totalRate / round.rate.length);
  
    return res.status(200).json(avgRate);
  });

  /**
   * @description Get Instructor rate by round id
   * @route /api/round/rate-instructor/:id
   * @method GET
   * @access public
   */
  static getRateInstructor = catchAsyncError(async function (req, res, next) {
    const { id } = req.params;
  
    const round = await roundModel.findById(id);
           
    if (!round) return next(new AppError("Round not found", 404));

    if (round.rateInstructor.length === 0) {
    
      return res.status(200).json(0);
    }
  
    const rates = round.rateInstructor.map(rate => rate.rate);
  
  
    const totalRate = rates.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  
    const avgRate = Math.round(totalRate / round.rateInstructor.length);
  
    return res.status(200).json(avgRate);
  });


  /**
   *  @description gets all the students in waiting list which matches the new round
   *  @route /api/admin/newRoundList
   *  @method GET 
   *  @access private (Super Admin Only)
   */
         static updateStudentList = catchAsyncError(async function(req, res,next) {
          const qualifyingPeriod = req.query.qualifyingPeriod
          const program = req.query.program
          const roundId = req.query.roundId
          let result
          const waitingList = await waitingListModel.find()
          .populate({
           path:"studentId",
           select:"name"
          })
          .populate({
           path:'roundId',
           select:"program name period",
           populate:{
             path:'program',
             select:'name'
           }
          })
          .then((res)=>{
           result= res.filter(ele=>{
            console.log(ele);
             return (ele.roundId.program._id == program && ele.roundId.period.qualifyingPeriod == qualifyingPeriod && ele.roundId._id != roundId)
           })
          })
          .catch((err)=>{
           return next(new AppError(err, 400))
          })
          res.status(200).json({
           length: result.length,
           result})
         });




/**
 * @description Apply Student to Round 
 * @route /api/round/apply
 * @method GET
 * @access public
 *
 */
  static applyStudent = catchAsyncError(async function(req, res,next) {

    const requiredFields = ['roundId', 'studentId']
    const body = _.pick(req.body,requiredFields)

    if(!body) return next(new AppError('Missing Data', 400))

    // if(req.user?.type != 'student') return next(new AppError("you are not allowed", 403));

    const student = await studentModel.findById(body.studentId)
    if(!student) return next(new AppError("Student is Not Found", 404));

    if(student.userSuspended.isSuspended === true){
      return res.status(403).json(
        {
          message : "Sorry you can't apply to this round , because you are suspend",
          reasonOfSuspend : student.userSuspended.reasonOfSuspend
        })
    }

    if(student.userDeleted.isDeleted === true){
      return res.status(403).json(
        {
          message : "Sorry you can't apply to this round , because you are suspend",
          reasonOfDeleted : student.userDeleted.reasonOfDeleted
        })
    }

    const applyRound = await roundModel.findById(body.roundId)
    applyRound.registrationList.push(body.studentId)
    applyRound.save()

    res.status(200).json({message: 'successfully applied to round'})
  });

}

module.exports = RoundController;