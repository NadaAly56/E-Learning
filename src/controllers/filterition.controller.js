
const instructorModel = require("../models/instructor.model");
const studentModel = require("../models/student.model");
const roundModel = require("../models/round.model");
const programModel = require("../models/program.models");
const AppError = require("../utils/appError.js")
const catchAsyncError = require("../middlewares/catchError.js");

class FiltrationController {
    /**
  * @description filter instructor
  * @route /api/admin/instructorFiltration
  * @method GET
  * @access private (admin only)
  */
  static instructorFiltration = catchAsyncError(async function(req,res,next){
    const pageSize = req.query.pageSize ||  20
    const pageNumber = req.query.pageNumber || 1
    const key = Object.keys(req.query)[0];
    const value = Object.values(req.query)[0].trim().toLowerCase();
    const filtered = {};
    filtered[key] = value;
    const filter = await instructorModel.find(filtered)
    .skip((pageNumber -1 ) * pageSize)
    .limit(pageSize)
    .populate('round')
    .populate({
      path: 'round',
      populate: {
        path: 'category subCategory program instructor responsibleOfIsPublish',
        select: "name -_id",
      }
    })
    .populate('specialization','name -_id')
    .populate({
      path: 'userSuspended',
      populate: {
        path: 'responsibleOfSuspend',
        select: "name -_id",
      }
    })
    .populate({
      path: 'userDeleted',
      populate: {
        path: 'responsibleOfDeleted',
        select: "name -_id",
      }
    })
    if (filter.length === 0) 
    {
      return res.status(404).json({ 
        result:filter.length,
        message:`the ${value} not found in ${key}`})
    }
    if (!filter) return next(new AppError("Invalid Data", 400))

    const results = await instructorModel.find().count()
    const pagesTotal  = results>pageSize? (results/pageSize) : 1

    return res.status(200).json(
        {
          results,
          requestResults: filter.length,
          pageNumber,
          pageSize,
          pagesTotal ,
          filter
      });
});

    /**
  * @description filter student
  * @route /api/admin/studentsFiltration
  * @method GET
  * @access private (admin only)
  */
    static studentFiltration = catchAsyncError(async function(req,res,next){
      const pageSize = req.query.pageSize ||  20
      const pageNumber = req.query.pageNumber || 1
        const key = Object.keys(req.query)[0];
        const value = Object.values(req.query)[0].trim().toLowerCase();
        const filtered = {};
        filtered[key] = value;
        const filter = await studentModel.find(filtered)
        .skip((pageNumber -1 ) * pageSize)
        .limit(pageSize)
        .populate({
          path: 'roundsLog',
          select:'-_id',
          populate:{
            path:'instructor responsibleOfIsPublish category subCategory program',
            select:'name -_id'
          }
        })
        .populate({
          path:"userSuspended",
          populate:{
            path: 'responsibleOfSuspend',
            select: "name -_id",
          }
        })
        .populate({
          path: 'userDeleted',
          populate: {
            path: 'responsibleOfDeleted',
            select: "name -_id",
          }
        })
        if (filter.length === 0) 
        {
          return res.status(404).json({ 
            result:filter.length,
            message:`the ${value} not found in ${key}`})
        }
        if (!filter) return next(new AppError("Invalid Data", 400))
        const results = await studentModel.find().count()
        const pagesTotal  = results>pageSize? (results/pageSize) : 1

        return res.status(200).json(
          {
            results,
            requestResults: filter.length,
            pageNumber,
            pageSize,
            pagesTotal ,
            filter
          });
    });
        /**
  * @description filter program
  * @route /api/admin/programsFiltration
  * @method GET
  * @access private (admin only)
  */
  static programFiltration = catchAsyncError(async function(req,res,next){
    const pageSize = req.query.pageSize ||  20
    const pageNumber = req.query.pageNumber || 1
    const key = Object.keys(req.query)[0];
    const value = Object.values(req.query)[0].trim().toLowerCase();
    const filtered = {};
    filtered[key] = value;
    const filter = await programModel.find(filtered)
    .skip((pageNumber -1 ) * pageSize)
    .limit(pageSize)
    .populate({
      path:'category subCategory createBy responsibleOfIsPublish responsibleOfIsDeleted instructorsLog',
      select:'name -_id'
    })
    .populate({
      path:'roundLog',
      select:'name startDate endDate start finish isClose period -_id'
    })
    if (filter.length === 0) 
    {
      return res.status(404).json({ 
        result:filter.length,
        message:`the ${value} not found in ${key}`})
    }
    if (!filter) return next(new AppError("Invalid Data", 400))
    const results = await programModel.find().count()
    const pagesTotal  = results>pageSize? (results/pageSize) : 1

    return res.status(200).json(
      {
        results,
        requestResults: filter.length,
        pageNumber,
        pageSize,
        pagesTotal ,
        filter
      });
});
    /**
  * @description filter round
  * @route /api/admin/roundsFiltration
  * @method GET
  * @access private (admin only)
  */
    static roundFiltration = catchAsyncError(async function(req,res,next){
      const pageSize = req.query.pageSize ||  20
      const pageNumber = req.query.pageNumber || 1
        const key = Object.keys(req.query)[0];
        const value = Object.values(req.query)[0].trim().toLowerCase();
        const filtered = {};
        filtered[key] = value;
        const filter = await roundModel.find(filtered)
        .skip((pageNumber -1 ) * pageSize)
        .limit(pageSize)
        .populate({
          path:'category subCategory program instructor responsibleOfIsPublish registrationList responsibleOfIsDeleted',
          select:'name -_id'
        })
        if (filter.length === 0) 
        {
          return res.status(404).json({ 
            result:filter.length,
            message:`the ${value} not found in ${key}`})
        }
        if (!filter) return next(new AppError("Invalid Data", 400))

        const results = await roundModel.find().count()
        const pagesTotal  = results>pageSize? (results/pageSize) : 1

        return res.status(200).json(
          {
            results,
            requestResults: filter.length,
            pageNumber,
            pageSize,
            pagesTotal ,
            filter
          });
    });
}
module.exports = FiltrationController;