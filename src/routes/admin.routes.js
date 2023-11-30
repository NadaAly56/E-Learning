const router = require("express").Router();
const validation = require("../middlewares/validation");
const Admin = require("../validations/admin.validation");
const AdminController = require("../controllers/admin.controller");
const Token = require("../middlewares/verifyToken");
const FiltrationController = require("../controllers/filterition.controller");
const SettingController = require("../controllers/setting.controller");
const Setting = require("../validations/settings.validation");
const fileUpload = require("../utils/fileUpload");
const roundController = require("../controllers/round.controller");
const AcceptedListController = require("../controllers/acceptedList.controller");
const ContactController = require("../controllers/contact.controller");
const WaitingList = require("../validations/waitingList.validation");







router // /api/admin
  .route("/")
  .get(  AdminController.getAdmins )
  .post(Token.authAdmin(['all']) ,fileUpload('image') ,validation(Admin.addAdmin), AdminController.addAdmin);

router
  .route("/settings") // api/admin/settings
  .get ( SettingController.getSettings    )
  .post(Token.authAdmin(['all']) ,fileUpload('image'), validation (Setting.addSettings    ), SettingController.addSettings    )
  .put (Token.authAdmin(['all']) , fileUpload('image'), validation (Setting.updateSettings ), SettingController.updateSettings );

router
  .route("/contact") // api/admin/contact
  .get ( Token.authAdmin(['all']) , ContactController.getContacts    )
  .post( ContactController.sendContact )

router.delete ("/contact/:id",Token.authAdmin(['all']) , ContactController.deleteContact );

// api/admin/contact/:id
router.get("/contact/:id",Token.authAdmin(['all']) ,  ContactController.GetContactById )


// /api/admin/instructorFiltration
router.get("/instructorFiltration",Token.authAdmin(['all','add']) , FiltrationController.instructorFiltration)

// /api/admin/studentsFiltration
router.get("/studentsFiltration" ,Token.authAdmin(['all','add']) ,FiltrationController.studentFiltration)

// /api/admin/programsFiltration
router.get("/programsFiltration" , Token.authAdmin(['all','add']) ,FiltrationController.programFiltration)

// /api/admin/roundsFiltration
router.get("/roundsFiltration" , Token.authAdmin(['all','add']) ,FiltrationController.roundFiltration)


// /api/admin/newRoundList
// it shows the waiting list on the round which has the same program and period of the new round created
router.get("/newRoundList"  ,Token.authAdmin(['all']) ,roundController.updateStudentList);

// /api/admin/acceptedPreviousWaitingList
// it's transform the student from waiting List to accepted List
router.post("/acceptedPreviousWaitingList"  ,Token.authAdmin(['all']) , validation(WaitingList.transformWaitingList) ,AcceptedListController.addFromWaitingList);


router // /api/admin/:id
  .route("/:id")
  .get( AdminController.getAdminById )
  .put( Token.authAdmin(['all']) ,validation(Admin.updateAdmin) , AdminController.updateAdmin )

  // /api/admin/profile/:id
  router.put("/profile/:id" ,Token.verifyToken  ,AdminController.updateProfileAdmin);







  

module.exports = router;