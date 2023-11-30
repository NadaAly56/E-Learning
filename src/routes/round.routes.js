const RoundController = require('../controllers/round.controller.js');
const validation = require("../middlewares/validation.js");
const router = require("express").Router();
const Round = require('../validations/round.validation');
const fileUpload = require("../utils/fileUpload");
const Token = require("../middlewares/verifyToken");

//------------------------------------------

//  /api/round
router.route('/')  
      .get(RoundController.getAllRounds)  
      .post(Token.authAdmin(['all']) ,validation(Round.addRound),RoundController.addRound);   


      
// /api/round/rate/:id
// adding rate to round and instructor 
// getting rate for round
router.route('/rate/:id')
      .post(Token.verifyToken, validation(Round.updateRateSchema),RoundController.addRoundRate)
      .get(Token.authAdmin(['all']) ,RoundController.getRateRound)

// /api/round/rate-instructor/:id
// getting instructor rate
router.get('/rate-instructor/:id', Token.authAdmin(['all']) ,RoundController.getRateInstructor);

// /api/round/apply
router.post('/apply',Token.verifyToken,validation(Round.applyStudent),RoundController.applyStudent);

// /api/round/:id
router.route('/:id')
      .put(Token.authAdmin(['all']) ,validation(Round.updateRound),RoundController.updateRound)
      .get(RoundController.getRoundByID);
//------------------------------------------

module.exports = router;