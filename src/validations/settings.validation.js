const joi = require("joi");


class Setting {


    static addSettings = joi.object({
        mail: joi.string().required().trim(),
        phoneNumbers: joi.any().required(),  // /^\d+$/
            facebook : joi.string().required(),
            instagram : joi.string().required(),
            linkedin : joi.string().required(),
            telegram : joi.string().required(),
            text : joi.array(),
            image : joi.array(),
        address :joi.any().required(),
        mission :joi.any().required(),
        vision :joi.any().required(),
     })

     static updateSettings = joi.object({
       mail: joi.string().trim().required().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        phoneNumbers: joi.array().items(joi.string().pattern(/^01[0125][0-9]{8}$/)).required(),
        facebook : joi.string().required(),
        instagram : joi.string().required(),
        linkedin : joi.string().required(),
        telegram : joi.string().required(),
            text : joi.array(),
            image : joi.array(),
            address :joi.any().required(),
            mission :joi.any().required(),
            vision :joi.any().required(),
     })
   }
module.exports = Setting;