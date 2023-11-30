const Joi = require("joi");

class  AcceptedList {

  static addAccepted = Joi.object({
    name : Joi.string().required().trim(),
    studentId: Joi.string().required(),
    roundId: Joi.string().required(),
  });
  
  static setScore = Joi.object({
    score: Joi.number().min(0).max(100).required(),
    studentId: Joi.string().required(),
    roundId: Joi.string().required(),
    
  });

  static updatedAccepted = Joi.object({
    studentId: Joi.string(),
    roundId: Joi.string(),
    score: Joi.number(),
    isDeleted: Joi.boolean(),
    responsibleOfIsDeleted : Joi.string().when('isDeleted', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  });
}

module.exports = AcceptedList;
