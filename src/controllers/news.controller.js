const mongoose = require("mongoose");
const _ = require("lodash");
const newsModel = require("../models/news.model.js");
const catchAsyncError = require("../middlewares/catchError.js")
const AppError = require("../utils/appError.js")
const fs = require("fs");
const path = require("path");

class NewsController {
  /**
   *  @description add new pages
   *  @route /
   *  @method POST
   *  @access public
   */
  static addNews = catchAsyncError(async function(req, res, next) {

      const body = _.pick(req.body,["type","createdBy","title","subTitle","desc","imageCover","isPublished"]);

      if (!body) return next(new AppError("Missing Data", 400));


      const existingNews = await newsModel.findOne({
        type: body.type,
        title: body.title
    })

      if (existingNews){
        return next(new AppError("already exists", 409));
      } 

      const {imageCover} = req.files
      if(!imageCover) return next(new AppError("Missing Image Cover", 400));

      body.imageCover = await imageCover[0].filename

      const newNews = await newsModel.create(body);
      res.status(201).json({message: `Successfully Created New ${body.type}`,});
  })
  /**
   *  @description update pages by id
   *  @route /:id
   *  @method PUT
   *  @access public
   */
  static updateNews = catchAsyncError(async function(req, res, next) {

      const newsId = req.params.id;
      const news = await newsModel.findById(newsId)
      .populate('createdBy','name -_id')
      const {imageCover} = req.files
      
      if (!news) return next(new AppError(" not found", 404));

      const body = _.pick(req.body, ["type", "createdBy", "title", "subTitle", "desc", "imageCover", "isPublished","isDelete"]);

      if (!body) return next(new AppError("Missing Data", 400));

      if(imageCover){
        if(fs.existsSync(path.join(__dirname, `../../uploads/${news.imageCover}`))){
          fs.unlinkSync(path.join(__dirname, `../../uploads/${news.imageCover}`))
        }
        body.imageCover = await imageCover[0].filename
      }
      const result = await newsModel.findByIdAndUpdate(newsId,body,{new :true});
      
      res.status(200).json({message : 'Successfully updated '});
  })
  /**
   *  @description get all pages
   *  @route /
   *  @method GET
   *  @access public
   */
  static getAllNews = catchAsyncError(async function(req, res, next){

    const { title } = req.query;
    // const pageSize = req.query.pageSize ||  20
    // const pageNumber = req.query.pageNumber || 1
    const query = title ? { title: title.trim() } : {};

    const news = await newsModel.find(query)
    // .skip((pageNumber -1 ) * pageSize)
    // .limit(pageSize)
    .populate('createdBy','name -_id')
    // const results = await newsModel.find().count()
    // const pagesTotal  = results>pageSize? (results/pageSize) : 1

    return res.status(200).json({

      // results,
      requestResults: news.length,
      // pageNumber,
      // pageSize,
      // pagesTotal ,
      news
    });
    


    
  })
  /**
   *  @description get pages by id
   *  @route /:id
   *  @method GET
   *  @access public
   */
  static getNewsById = catchAsyncError(async function(req, res, next) {

      const newsId = req.params.id; 
      const news = await newsModel.findById(newsId)
      .populate('createdBy','name -_id')

      if (!news) return next(new AppError("pages not found", 404));

      return res.status(200).json(news);
  })
}
module.exports = NewsController;
