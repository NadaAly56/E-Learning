const mongoose = require("mongoose");
const _ = require("lodash");
const subCategoryModel = require("../models/subCategory.model");
const AppError = require("../utils/appError.js")
const catchAsyncError = require("../middlewares/catchError.js")
const fs = require("fs");
const path = require("path");
class SubCategoryController {
  /**
   *  @description add new subCategory
   *  @route /api/subCategory
   *  @method POST
   *  @access private (Admin)
   */
  static addSubCategory = catchAsyncError(async function(req, res, next) {
      
      const {image} = req.files
    console.log(image);
      const body = _.pick(req.body , ['name' ,'category' , 'isActive' , 'image']);
      if (!body) return next(new AppError("Missing required data", 400))
      if (!image) return next(new AppError("Missing image", 400))

      body.image  = await image[0].filename

      const existSubCategory = await subCategoryModel.findOne({name: body.name , category : body.category}).populate('category');
      if (existSubCategory) return next(new AppError("SubCategory already exists", 409))

      const newSubCategory = await subCategoryModel.create(body);
      return res.status(201).json({message: 'Successfully added SubCategory'});

  })

  /**
   *  @description get subCategories by id
   *  @route /api/subCategory/:id
   *  @method GET
   *  @access public
   */
  static getSubCategoryById = catchAsyncError(async function(req, res, next){

      const  subCategoryId = req.params.id;

      const subCategories = await subCategoryModel.findById(subCategoryId)
      .populate('category','name ')
      res.status(200).json(subCategories);
  })

  /**
   *  @description get all subCategories
   *  @route /api/subCategory/
   *  @method GET
   *  @access public
   */
  static getAllSubCategory = catchAsyncError(async function(req, res, next){

      const { name } = req.query;
      const query = name ? { name: name.trim().toLowerCase() } : {};

      const subCategories = await subCategoryModel.find(query)
      .populate('category')
      res.status(200).json({

        requestResults: subCategories.length,
        subCategories,
      });
  })
  
  /**
   *  @description Update subCategory by id
   *  @route /api/subCategory/:id
   *  @method PUT
   *  @access public
   */
  static updateSubCategory = catchAsyncError(async function(req, res, next){
      const subcategoryId = req.params.id;
      const {image} = req.files
      
      const allowedFields = [
        "name",
        "isDelete",
        "isActive",
        'image'
      ];
      const body = _.pick(req.body, allowedFields);
      if(!body) return next(new AppError("Missing data", 400))

      const subcategory= await subCategoryModel.findById(subcategoryId);
      if (!subcategory) return next(new AppError("subcategory not found", 404))

      if(image){
        if(fs.existsSync(path.join(__dirname, `../../uploads/${subcategory.image}`))){
          fs.unlinkSync(path.join(__dirname, `../../uploads/${subcategory.image}`))
        }
        body.image  = await image[0].filename
      }

      
      const subcategoryUpdated = await subCategoryModel.findByIdAndUpdate(subcategoryId,body,{new: true});
      return res.status(201).json({ subcategoryUpdated , message: "subcategory updated"})

  })
}
module.exports = SubCategoryController;