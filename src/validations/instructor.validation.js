const Joi = require("joi");

class Instructor {
  static addInstructor = Joi.object({
    name: Joi.string()
      .required()
      .min(3)
      .max(20),
    fullName: Joi.string()
      .required()
      .min(8)
      .max(70),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    nationalID: Joi.string()
      .required()
      .pattern(
        /^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$/
      ),
    phone: Joi.string()
      .required()
      .pattern(/^01[0125][0-9]{8}$/),
    specialization: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string()
      .required()
      .valid("male", "female"),
    isFreelancing: Joi.boolean().default(false),
    bio: Joi.string().default("No description"),
  nationalIDCard: Joi.string(),
  photo: Joi.string().default("default_Avatar.jpg"),
  cv: Joi.string().label("CV"),
  certificates: Joi.string(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  });

  static updateInstructor = Joi.object({
    name: Joi.string().min(3).max(20),
    fullName: Joi.string().min(8).max(70),
    phone: Joi.string().pattern(new RegExp('^01[0125][0-9]{8}$')),
    dateOfBirth: Joi.date().iso(),
    gender: Joi.string().valid('male', 'female'),
    isAvailable: Joi.boolean(),
      bio: Joi.string(),
      photo: Joi.string(),
      cv: Joi.string(),
      country: Joi.string().required(),
      city: Joi.string().required(),
  });

  static adminUpdateInstructor = Joi.object({
    name: Joi.string().min(3).max(20),
    fullName: Joi.string().min(8).max(70),
    email: Joi.string().email(),
    nationalID: Joi.string().pattern(new RegExp('^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$')),
    phone: Joi.string().pattern(new RegExp('^01[0125][0-9]{8}$')),
    dateOfBirth: Joi.date().iso(),
    gender: Joi.string().valid('male', 'female'),
    round: Joi.array().items(Joi.string()),
    roundsLog: Joi.array().items(Joi.string()),
    rate: Joi.number().min(1).max(5),
    isFreelancing: Joi.boolean(),
    isAvailable: Joi.boolean(),
      responsibleOfDeleted: Joi.string().when('isDeleted', { is: true, then: Joi.required() }),
      isDeleted: Joi.boolean(),
      reasonOfDeleted: Joi.string().when('isDeleted', { is: true, then: Joi.string().min(25).required() }),
    specialization: Joi.string().required(),
      bio: Joi.string(),
      nationalIDCard: Joi.string(),
      photo: Joi.string(),
      cv: Joi.string(),
      country: Joi.string(),
      city: Joi.string(),
      responsibleOfSuspend: Joi.string().when('isSuspended', { is: true, then: Joi.required() }),
      isSuspended: Joi.boolean(),
      reasonOfSuspend: Joi.string().when('isSuspended', { is: true, then: Joi.string().min(25).required() })
  });
}

module.exports = Instructor;