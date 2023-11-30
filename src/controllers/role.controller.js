const roleModel = require("../models/role.model");
const _ = require("lodash");
const AppError = require("../utils/appError.js")

class RoleController {


  /**
   * @description Get All roles
   * @route /api/role
   * @method Get
   * @access private (Admin)
   */
    static  getRoles = catchAsyncError(async function(req, res,next) {

      const { name } = req.query;
      const query = name ? { name: name.trim() } : {};
      const roles = await roleModel.find(query);

      if (roles.length === 0) return next(new AppError("No roles found", 404))
    
      return res.status(200).json({requestResults: roles.length,roles});

    }
  )

  /**
   * @description get a role by id
   * @route /api/role/:id
   * @method GET
   * @access private (Admin)
   */
    static  getRoleById = catchAsyncError(async function(req, res,next) {

      const id = req.params.id;
      const role = await roleModel.findById(id);

      if (!role) return next(new AppError("Role not found", 404))

      return res.status(200).json(role);
  }
)
  /**
   * @description add a new role
   * @route /api/role
   * @method POST
   * @access private (Admin)
   */
    static addRole = catchAsyncError(async function(req, res,next) {

      const allowedFields = ["name", "permissions"];
      const body = _.pick(req.body, allowedFields);

      if(!body) return next(new AppError("Missing Data", 400))

      const existingRole = await roleModel.findOne({name :body.name })

      if(existingRole) return next(new AppError("Role is already exists", 409))

      const newRole = await roleModel.create(body);
      return res.status(201).json(newRole);

    }
  )

  /**
   * @description update a role
   * @route /api/role/updateRole
   * @method PUT
   * @access private (Admin)
   */
  static updateRole = catchAsyncError(async function(req, res,next) {

      const roleId  = req.params.id;
      const allowedFields = ["name", "permissions", "isDelete"];
      const body = _.pick(req.body, allowedFields);

      const role = await roleModel.findById(roleId);

      if(!body) return next(new AppError("Missing Data", 400))

      if(!role) return next(new AppError("Role not found", 400))

      const newRole = await roleModel.findByIdAndUpdate(roleId,body,{new:true})
      return res.status(200).json(newRole);

    }
  )


}
module.exports = RoleController;