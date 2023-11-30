const validation = require("../middlewares/validation");
const WaitingList = require("../validations/waitingList.validation");
const waitingListController = require("../controllers/waitinglist.controller");
const express = require("express");
const Token = require("../middlewares/verifyToken");


const router = express.Router();

router
  .route("/")
  .get( Token.authAdmin(['all']) , waitingListController.getAllWaitingList)
  .post( Token.authAdmin(['all']) ,validation(WaitingList.addWaitingList),
    waitingListController.addWaitingList
  );

router.get('/:id', Token.authAdmin(['all']) , waitingListController.getWaitingListsByIdRound )
router.post('/delete', Token.authAdmin(['all']) ,waitingListController.deleteWaitingLists )
router.put('/:id',Token.authAdmin(['all']), validation(WaitingList.updateWaitingList), waitingListController.updateWaitingList);

module.exports = router;