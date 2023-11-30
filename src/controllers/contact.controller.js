
const _ = require("lodash");
const AppError = require("../utils/appError.js")
const catchAsyncError = require("../middlewares/catchError.js");
const contactModel = require("../models/contact.model");
const xssAttack = require("../utils/xssAttack")


class ContactController {

  /**
   * @description Get Contacts
   * @route /api/admin/contact
   * @method GET
   * @access private (Admin)
   */

  static  getContacts = catchAsyncError(async function(req, res, next) {
        // const pageSize = req.query.pageSize ||  20
        // const pageNumber = req.query.pageNumber || 1

        const contact = await contactModel.find()
        // .skip((pageNumber -1 ) * pageSize)
        // .limit(pageSize)

        // const results = await contactModel.find().count()
        // const pagesTotal  = results>pageSize? (results/pageSize) : 1

        return res.status(200).json(
        {
            // results,
            requestResults: contact.length,
            // pageNumber,
            // pageSize,
            // pagesTotal ,
            contact
        })
  })

  /**
   * @description Send Contact
   * @route /api/contact
   * @method POST
   * @access public
  */
 static sendContact = catchAsyncError(async function(req, res, next){
  
    const requiredFields =  [
                            "email", "name" ,
                            "subject" , "message"
                            ]

    let body = _.pick(req.body, requiredFields);

    if (!body) return next(new AppError("Missing  Data", 400))

        const existingContact = await contactModel.findOne({email: body.email ,subject : body.subject})
        
        if (existingContact) return next(new AppError("You already have same contact'", 409))
        
        body = xssAttack(body)
        const contact = await contactModel.create(body)

        return res.status(201).json(
          {
            message : 'Successfully send contact',
            contact
          })
  })

  /**
   * @description Delete Contact
   * @route /api/admin/contact/:id
   * @method DELETE
   * @access private (Admin)
   */
  static deleteContact = catchAsyncError(async function(req, res, next){

      const contactId = req.params.id
        const contact = await contactModel.findOneAndDelete(contactId)

        return res.status(200).json({message : 'Successfully delete contact'})
  })

  /**
   * @description Get Contact By Id
   * @route /api/contact/:id
   * @method GET
   * @access private (Admin)
   */
  static GetContactById = catchAsyncError(async function(req, res, next){

      const contactId = req.params.id
        const contact = await contactModel.findById(contactId)

        return res.status(200).json(contact)
  })



}

module.exports = ContactController;