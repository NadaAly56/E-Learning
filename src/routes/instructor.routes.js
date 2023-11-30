const express = require("express");
const validation = require("../middlewares/validation");
const Instructor = require("../validations/instructor.validation");
const InstructorController = require("../controllers/instructor.controller");
const router = express.Router();
const fileUpload = require("../utils/fileUpload");
const Token = require("../middlewares/verifyToken");

//------------------------------------------



//  /api/instructor
router
  .route("/")
  .get( InstructorController.getAllInstructors)
  .post(Token.authAdmin(['all']) ,fileUpload('nationalIDCard','photo','cv'),
        validation( Instructor.addInstructor) , InstructorController.addInstructor );

//  /api/instructor/:id
router.route("/:id").get(InstructorController.getInstructorById);

//  /api/instructor/actions/:id
router.put(("/actions/:id"),Token.authAdmin(['all']),fileUpload('nationalIDCard','photo','cv'),
            validation(Instructor.adminUpdateInstructor), InstructorController.adminUpdateInstructor);

//  /api/instructor/:id
router.route("/:id").put(Token.authUserAndAdmin(['all']),fileUpload('photo', 'cv'),
            validation(Instructor.updateInstructor),InstructorController.updateInstructor);

// /api/instructor/profile/info
router.get("/profile/info",Token.verifyToken, InstructorController.instructorInfo);


//------------------------------------------
module.exports = router;