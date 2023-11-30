const express = require("express");
const validation = require("../middlewares/validation");
const RejectedList = require("../validations/rejectedList.validation");
const rejectedListController = require("../controllers/rejectedList.controller");
const router = express.Router();
const Token = require("../middlewares/verifyToken");

router
  .route("/")
  .post(Token.authAdmin(['all']) ,validation(RejectedList.addingRejectedST),rejectedListController.addRejectedList)
  .get(rejectedListController.getAllRejectedList);
router.get('/:id' , rejectedListController.getRejectedListbyIdRound)
router.delete('/' ,Token.authAdmin(['all']) , rejectedListController.deleteRejectedList)

module.exports = router;