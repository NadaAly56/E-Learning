const Joi = require("joi");

class Round {
  static addRound = Joi.object({
    name: Joi.string()
      .trim()
      .min(3)
      .max(20)
      .required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    duration: Joi.string()
      .trim()
      .required(),
    category: Joi.string().required(),
    subCategory: Joi.string().required(),
    program: Joi.string().required(),
    period: Joi.object({
      days: Joi.number().required(),
      qualifyingPeriod: Joi.string()
        .trim()
        .valid("morning", "evening")
        .required(),
    }).required(),
    minimumStudents: Joi.number().required(),
    maximumStudents: Joi.number().required(),
    registrationStart: Joi.date().required(),
    registrationEnd: Joi.date().required(),
    docRequired:Joi.array().required(),
    instructor:Joi.string().required(),
    roundEligibility:Joi.array().required(),
    isPublish:Joi.boolean().required(),
    responsibleOfIsPublish:Joi.string().required(),
    isAvailable:Joi.boolean().required(),
    createBy: Joi.string().required(),
   
  });
  static updateRound = Joi.object({
    name: Joi.string()
      .trim()
      .min(3)
      .max(20),
    startDate: Joi.date(),
    endDate: Joi.date(),
    duration: Joi.string().trim(),
    period: Joi.object({
      days: Joi.number(),
      qualifyingPeriod: Joi.string()
        .trim()
        .valid("morning", "evening"),
    }),
    roundEligibility:Joi.array(),
    // closeReason: Joi.string(),
    // closeDate: Joi.date(),
    minimumStudents: Joi.number(),
    maximumStudents: Joi.number(),
    registrationStart: Joi.date(),
    registrationEnd: Joi.date(),
    instructor: Joi.string(),
    isAvailable: Joi.boolean(),
    program: Joi.string(),
    subCategory: Joi.string(),
    category: Joi.string(),
    docRequired: Joi.array(),
    start: Joi.boolean(),
    finish: Joi.boolean(),
    

    actualEndDate: Joi.optional().when('finish', { is: true, then: Joi.date().required() }),
    actualStartDate: Joi.optional().when('start', { is: true, then: Joi.date().required() }),
    isDeleted: Joi.boolean(),
    responsibleOfIsDeleted: Joi.string().when('isDeleted', { is: true, then: Joi.required() }),
    isClose: Joi.boolean(),
    closeDate: Joi.date().when('isClose', { is: true, then: Joi.required() }),
    closeReason: Joi.optional().when('isClose', { is: true, then: Joi.string().required() }),
    responsibleOfClose: Joi.string().when('isClose', { is: true, then: Joi.required() }),
    isPublish: Joi.boolean(),
    responsibleOfIsPublish: Joi.string().when('isPublish', { is: true, then: Joi.required() }),
   })

static updateRateSchema = Joi.object({
    roundRateValue: Joi.number().valid(1, 2, 3, 4, 5).required(),
    instructorRateValue: Joi.number().valid(1, 2, 3, 4, 5).required(),
    rate: Joi.array()
    .items(
        Joi.object({
            id: Joi.string().required(), 
            rate: Joi.number().valid(1, 2, 3, 4, 5).required(),
        })
    ),
    rateInstructor: Joi.array()
    .items(
        Joi.object({
            id: Joi.string().required(), 
            rate: Joi.number().valid(1, 2, 3, 4, 5).required(),
        })
    ),
  });

static applyStudent = Joi.object({
    roundId : Joi.string().required(),
    studentId : Joi.string().required(),
  });
}  

module.exports = Round;