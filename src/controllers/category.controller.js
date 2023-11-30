const mongoose = require("mongoose");
const _ = require("lodash");
const categoryModel = require("../models/category.model");
const AppError = require("../utils/appError.js")
const catchAsyncError = require("../middlewares/catchError.js")

class CategoryController {
  /**
   *  @description add new category
   *  @route /api/category
   *  @method POST
   *  @access private (Admin)
   */
  static addCategory = catchAsyncError(async function(req, res, next){

      const body = _.pick(req.body,['name', 'isActive'])
      if (!body) return next(new AppError("Missing Data", 400))
      
      const existsCategory = await categoryModel.findOne({name : body.name})
      
      if(existsCategory) return next(new AppError("Category has already exists", 409))

      const newCategory = await categoryModel.create(body);

      res.status(201).json(
        {
          message : 'Successfully Add Category',
          newCategory
        });

  })
  /**
   *  @description get all categories
   *  @route /api/category
   *  @method GET
   *  @access public
   */
  static getAllCategory = catchAsyncError(async function(req, res, next) {


      const { name } = req.query;
      const query = name ? { name: name.trim() } : {};


      const categories = await categoryModel.find(query)


            return res.status(200).json(
            {
                requestResults: categories.length,
                categories
            })

  })

  /**
   *  @description Update category by id
   *  @route /api/category/:id
   *  @method PUT
   *  @access public
   */
  static updateCategory = catchAsyncError(async function(req, res, next){

      const categoryId = req.params.id;
      const allowedFields = [
        "name",
        "isDelete",
        "isActive"
        
      ];
      const body = _.pick(req.body, allowedFields);

      if (!body) return next(new AppError("Missing Data", 400))

      const category= await categoryModel.findById(categoryId);

      if (!category) return next(new AppError("Category not found", 404))

      const categoryUpdated = await categoryModel.findByIdAndUpdate(categoryId , body ,{new: true});
      return res.status(200).json({categoryUpdated, message: "Successfully updated category " });
    
  })

  /**
   *  @description Get category by id
   *  @route /api/category/:id
   *  @method GET
   *  @access public
   */
  static getCategoryById = catchAsyncError(async function(req, res, next){

      const categoryId = req.params.id;

      const category= await categoryModel.findById(categoryId);

      if (!category) return next(new AppError("Category not found", 404))

      return res.status(200).json(category);
    
  })
}
module.exports = CategoryController;