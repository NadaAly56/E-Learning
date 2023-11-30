const joi = require("joi");
class News{
     static addNews= joi.object({
        type: joi.string().valid('event', 'news').required(),
        createdBy:joi.string().required().trim(),
        title: joi.string().required().min(3).trim(),
        subTitle: joi.string().required().min(3).trim(),
        desc: joi.string().required().min(10).trim(),
        imageCover: joi.string(),
        isPublished: joi.boolean().required(),
     });
     static updateNews = joi.object({
        type: joi.string().valid('event', 'news'),
        createdBy:joi.string().min(3).max(30).trim(),
        title: joi.string().min(3).trim(),
        subTitle: joi.string().min(3).trim(),
        desc: joi.string().min(10).trim(),
        imageCover: joi.string(),
        isPublished: joi.boolean(),
        isDelete: joi.boolean(),
     });
   }
module.exports = News;