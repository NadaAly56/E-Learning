const express = require("express");
const validation = require("../middlewares/validation.js");
const Program = require("../validations/program.validation.js");
const ProgramController = require("../controllers/program.controller.js");
const Token = require("../middlewares/verifyToken");


const router = express.Router();

// get all programs (we can search by name) &  add program
router
  .route("/")
  .get(ProgramController.getPrograms)
  .post(Token.authAdmin(['all']) ,fileUpload('image','certificate')
   ,validation(Program.addProgram), ProgramController.addProgram);

// get program & delete program & un delete program by id
router
  .route("/:id")
  .get(ProgramController.getProgramById)


// /api/program/:id
router
    .route("/:id")
    .put(Token.authAdmin(['all']) ,fileUpload('image','certificate')
     ,validation(Program.updateProgram) ,ProgramController.updateProgram);


module.exports = router;
