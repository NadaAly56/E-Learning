const router = require("express").Router();
const validation = require("../middlewares/validation");
const Role = require("../validations/role.validation");
const RoleController = require("../controllers/role.controller");
const Token = require("../middlewares/verifyToken");

router
  .route("/")
  .get( Token.authAdmin(['all']) , RoleController.getRoles )
  .post(Token.authAdmin(['all']),validation(Role.addRole), RoleController.addRole );

router
  .route("/:id")
  .get( Token.authAdmin(['all']) , RoleController.getRoleById )
  .put( Token.authAdmin(['all']) , validation(Role.updateRole) , RoleController.updateRole );


module.exports = router;