const joi = require("joi");

class Category {
     static addCategory = joi.object({
        name: joi.string().required().min(3).max(30).trim(),
        isActive: joi.boolean().required(),
     })

     static updateCategory = joi.object({
      name: joi.string().min(3).max(30).trim(),
      isActive: joi.boolean(),
      isDelete: joi.boolean()
   })}
module.exports = Category;