const joi = require("joi");
class Admin {
  static addAdmin = joi.object({
    name: joi
      .string()
      .required()
      .min(3)
      .max(20)
      .trim(),
    email: joi
      .string()
      .lowercase()
      .required()
      .pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
    password: joi
      .string()
      .required()
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    role: joi.string().required(),
    image : joi.string()
  });

  static updateAdmin = joi.object({
    name: joi
      .string()
      .min(3)
      .max(20)
      .trim(),
    role: joi.string(),
    isDeleted :joi.boolean()
  });

}
module.exports = Admin;