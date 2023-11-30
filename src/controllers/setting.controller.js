
const _ = require("lodash");
const settingModel = require("../models/setting.model");
const uploadError = require("../utils/uploadError")
const AppError = require("../utils/appError.js")
const catchAsyncError = require("../middlewares/catchError.js");
const fs = require("fs");
const path = require("path");

class SettingController {

  /**
   * @description Get Settings 
   * @route /api/admin/settings
   * @method GET
   * @access public
   */

  static  getSettings = catchAsyncError(async function(req, res, next) {

        const settings = await settingModel.findOne()
        if (settings === null) return res.status(200).json({message: 'Settings Is Empty'});
        return res.status(200).json(settings);
  })

  /**
   * @description Add Settings
   * @route /api/admin/settings
   * @method POST
   * @access public
  */
 static addSettings = catchAsyncError(async function(req, res, next){
  
    const requiredFields =  [
                            "mail", "phoneNumbers" ,
                            "address" , "text",
                            "mission" , "vision",
                            "image" 
                            ]
                            const {image} = req.files
                            console.log(req.files);
                            const {text} = req.body
                            const {instagram,facebook,linkedin,telegram} = req.body
                            const socialMedia ={instagram,facebook,linkedin,telegram}
                            
                            
                            let body = _.pick(req.body, requiredFields);

        if (!body) return next(new AppError("Missing required data", 400))

        if(!image) return next(new AppError("Missing image", 400))
        
        const existingSetting = await settingModel.findOne()

        if (existingSetting !== null) {
          return new AppError("Settings is already exists", 409)
        }

        let carousel= []
        for(let i=0; i<image.length; i++){
          carousel.push({image :image[i].filename , text:text[i]})
          }
          if(typeof(body.phoneNumbers) == 'string'){
            body.phoneNumbers = body.phoneNumbers.split(",")
          }
          if(typeof(body.address) == 'string'){
            body.address = body.address.split(",")
          }
          if(typeof(body.mission) == 'string'){
            body.mission = body.mission.split(",")
          }
          if(typeof(body.vision) == 'string'){
            body.vision = body.vision.split(",")
          }

        const settings = await settingModel.create({...body,carousel,socialMedia})

        return res.status(201).json({message : 'Successfully added Settings'})
  })

  /**
   * @description Add Settings
   * @route /api/admin/settings
   * @method POST
   * @access public
   */
  static updateSettings = catchAsyncError(async function(req, res, next){

        const requiredFields =  [
                                  "mail", "phoneNumbers" ,
                                  "address" , "text",
                                  "mission" , "vision",
                                ]

          const {image} = req.files
          const text = req.body.text
          const {instagram,facebook,linkedin,telegram} = req.body
          const socialMedia ={instagram,facebook,linkedin,telegram}
          
          let body = _.pick(req.body, requiredFields);
          if (!body) return next(new AppError("Missing required data", 400))

          const settings = await settingModel.findOne()
          let carousel= []
          if(image) {

            settings.carousel.map(f =>{
              console.log(f);
              fs.unlinkSync(path.join(__dirname, `../../uploads/${f.image}`))
            })
            
              for(let i=0; i<image.length; i++){
                carousel.push({image :image[i].filename , text:text[i]})
              }
          }else{
            carousel = settings.carousel
          }
          const settingUpdated = await settingModel.findOneAndUpdate(
            {_id : settings._id.toString()},{...body,socialMedia,carousel},{new : true}
            )
                    
        
        return res.status(201).json(settingUpdated)
  })
}

module.exports = SettingController;