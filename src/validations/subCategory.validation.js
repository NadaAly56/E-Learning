const joi = require("joi");
class SubCategory{
     static addSubCategory = joi.object({
        name: joi.string().required().min(3).max(70).trim(),
        category: joi.string().required(),
        isActive: joi.boolean().required(),
     })
     static updateSubCategory = joi.object({
      name: joi.string().min(3).max(70).trim(),
      category: joi.string(),
      isActive: joi.boolean(),
      isDelete: joi.boolean(),
   })}
module.exports = SubCategory;