const validation = require("../middlewares/validation.js");
const AcceptedList = require("../validations/acceptedList.validation.js")
const AcceptedListController = require("../controllers/acceptedList.controller.js");
const router = require("express").Router();
const Token = require("../middlewares/verifyToken.js");

// /api/acceptedLists
router
  .route("/")
  .get(Token.authAdmin(['all']),AcceptedListController.getAllAcceptedList)
  .post(Token.authAdmin(['all']) ,validation(AcceptedList.addAccepted), AcceptedListController.addAcceptedList);

  // api/acceptedList/:id
  router.get('/:id',Token.authAdmin(['all']) ,AcceptedListController.getAcceptedListbyIdRound)
  router.post('/delete',Token.authAdmin(['all']) ,AcceptedListController.deleteAcceptedList)

// /api/acceptedList/:id
router.route("/:id").put(Token.authAdmin(['all']),validation(AcceptedList.updatedAccepted), AcceptedListController.updateAcceptedList);

// /api/acceptedList/setScore?
router.route("/setScore").post(Token.authAdmin(['all']), validation(AcceptedList.setScore) , AcceptedListController.setScore);

module.exports = router;
