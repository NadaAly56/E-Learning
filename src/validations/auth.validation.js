const joi = require('joi');


class Auth {

    static login = joi.object({
        email: joi.string().lowercase().required(),
        password: joi.string().required(),
    })

    static email = joi.object({
        email: joi.string().lowercase().required().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
    })

    static setNewPassword = joi.object({
        password: joi.string().required().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        code : joi.string().required().trim()
    })

}




module.exports = Auth