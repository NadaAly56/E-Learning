const joi = require("joi");

class Program {
  static addProgram = joi.object({
    name: joi.string().min(3).required().trim(),
    
    category: joi.string().required(),
    
    subCategory: joi.string().required(),
    
    level: joi.string().required(),
    
    skillsRequired: joi.string().required(),
    
    skillsProgram: joi.string().required(),
    
      description: joi.string().required(),
      image: joi.string(),
      certificate: joi.string(),

    programEligibility: joi.string().required(),
    
    createBy: joi.string().required(),
    
    isAvailable: joi.boolean().required(),
    
    isPublish: joi.boolean().required(),
    
    responsibleOfIsPublish: joi.string().required(),
    
  });

  static updateProgram = joi.object({
    name: joi.string().min(3).max(60).trim(),
    
    category: joi.string(),
    
    subCategory: joi.string(),
    
    level: joi.string(),
    
    skillsRequired: joi.string(),
    
    skillsProgram: joi.string(),
    
      description: joi.string(),
      image: joi.string(),
      certificate: joi.string(),
    
    programEligibility: joi.string(),
    
    createBy: joi.string(),
    
    isAvailable: joi.boolean(),
    
    isPublish: joi.boolean(),
    
    isDeleted: joi.boolean(),
    
    responsibleOfIsDeleted : joi.string().when('isDeleted', {
      is: true,
      then: joi.required(),
      otherwise: joi.optional(),
    }),
    responsibleOfIsPublish: joi.string()
    
  });
}

module.exports = Program