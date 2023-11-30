const Joi = require("joi");

class RejectedList {
  static addingRejectedST = Joi.object({
    studentId: Joi.string().required(),
    roundId: Joi.string().required(),
    rejectedReason: Joi.string()
      .required()
      .min(25)
      .message("Reason is too short"),
    responsibleOfRejected: Joi.string().required(),
  });
}

module.exports = RejectedList;