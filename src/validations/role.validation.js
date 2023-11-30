const joi = require("joi");
class Role {
  static addRole = joi.object({
    name: joi
      .string()
      .required()
      .min(3)
      .max(20)
      .trim(),
    permissions: joi.array().items(joi.string().trim().lowercase()).required(),
  });
  static updateRole = joi.object({
    name: joi
      .string()
      .min(3)
      .max(20)
      .trim(),
    permissions: joi.array().items(joi.string().trim().lowercase()),
    isDelete: joi.boolean(),
  });
}

module.exports = Role;