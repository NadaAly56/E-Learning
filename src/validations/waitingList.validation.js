const joi = require("joi");

class WaitingList {
  static addWaitingList = joi.object({
    studentId: joi.string().required(),
    roundId: joi.string().required(),
  });

  static transformWaitingList = joi.object({
    studentId: joi.string().required(),
    roundId: joi.string().required(),
  });
  static updateWaitingList = joi.object({
    studentId: joi.string(),
    roundId: joi.string(),
    isDeleted: joi.boolean(),
  });
}

module.exports = WaitingList;
