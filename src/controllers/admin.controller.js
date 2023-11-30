const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

const adminModel = require("../models/admin.model");
const userModel = require("../models/user.model");
const sendEmail = require('../emails/user.email.js')
const AppError = require("../utils/appError.js")


class AdminController {



  /**
   *  @description get all admins and search by name
   *  @route /api/admin
   *  @method GET
   *  @access private (Super Admin)
   */
  static getAdmins = catchAsyncError(async function(req, res,next) {

    const { name } = req.query;
    const query = name ? { name: name.trim() } : {};
    const admins = await adminModel.find(query).populate("role");

    res.status(200).json({
      results: admins.length,
      admins
    });
  })



  /**
   * @description get admin by id
   * @route /api/admin/:id
   * @method GET
   * @access private (Super Admin and Admin himself)
   */
  static  getAdminById = catchAsyncError(async function(req, res,next) {

      const id = req.params.id;
      const admin = await adminModel.findById(id).populate("role");

      if (!admin) return next(new AppError("admin not found", 404))
      return res.status(200).json(admin);

  }
  )



  /**
   *  @description add new admin
   *  @route /api/admin/
   *  @method POST
   *  @access private (Super Admin)
   */
  static addAdmin = catchAsyncError(async function(req, res,next) {

      const redirectLink  = req.header('redirectLink')
      const requiredFields = ["name", "email", "password", "role" , "image"];
      const body = _.pick(req.body, requiredFields);
      

      if (!body) return next(new AppError("Missing required fields", 400))
      
      body.password = await bcrypt.hash(body.password , Number(process.env.SALT))

      const existAdmin = await adminModel.findOne({email : body.email})
      if (existAdmin) return next(new AppError("admin has already found", 409))
      
      const existingUser = await userModel.findOne({email : body.email})
      if (existingUser) return next(new AppError('User has already existing'),409)
  
      const {image} = req.files
      if(!image) return next(new AppError("Missing Image", 400))
      body.image = await image[0].filename

      const newAdmin = await adminModel.create(body);

      const user ={_id :newAdmin._id , name : body.name , email: body.email, password: body.password , type: 'admin', role: body.role}
      const newUser = await userModel.create(user);
      
      sendEmail({email:body.email, redirectLink, subject: "Email Confirmation"})
      return res.status(201).json({message:'Added Admin successfully'});

  })



  /**
   *  @description update an admin by id
   *  @route /api/admin/:id
   *  @method PUT
   *  @access private (Super Admin Only)
   */
  static updateAdmin = catchAsyncError(async function(req, res,next) {

        const adminId = req.params.id;
        const admin = await adminModel.findById(adminId);
        const body = _.pick(req.body,['name','role','isDeleted'])

        if (!admin) return next(new AppError("admin not found", 404)) 
        if (!body)  return next(new AppError("please enter the fields you want to update", 400))


        const newAdmin = await adminModel.findByIdAndUpdate(adminId,body,{new:true})
        const newUser = await userModel.findByIdAndUpdate(adminId,body,{new:true});

        return res.status(200).json({message : 'Successfully updated admin'});
    }
  )

  
  /**
   *  @description update an admin by id
   *  @route /api/admin/profile/:id
   *  @method PUT
   *  @access private (Super Admin Only)
   */
  static updateProfileAdmin = catchAsyncError(async function(req, res,next) {

        const adminId = req.params.id;
        const admin = await adminModel.findById(adminId);
        const body = _.pick(req.body,['name'])

        if (!admin) return next(new AppError("admin not found", 404)) 
        if (!body)  return next(new AppError("please enter the fields you want to update", 400))


        const newAdmin = await adminModel.findByIdAndUpdate(adminId,body,{new:true})
        const newUser = await userModel.findByIdAndUpdate(adminId,body,{new:true});

        return res.status(200).json({message : 'Successfully updated'});
    }
  )

}

module.exports = AdminController;