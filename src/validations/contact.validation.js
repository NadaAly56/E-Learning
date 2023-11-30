const joi = require('joi');


class Contact {

    static addContact = joi.object({
        email: joi.string().required(),
        name: joi.string().required(),
        subject: joi.string().required(),
        message: joi.string().required(),
    })
}




module.exports = Contact