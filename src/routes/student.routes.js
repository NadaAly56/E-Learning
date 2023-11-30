const StudentController = require("../controllers/student.controller.js");
const validation = require("../middlewares/validation.js");
const Student = require("../validations/student.validation.js");
const router = require("express").Router();
const Token = require("../middlewares/verifyToken");
const fileUpload = require("../utils/fileUpload");




// /api/student
router
  .route("/")
  .get( Token.authAdmin(['all']), StudentController.getStudents)
  .post(fileUpload('photo','nationalIDCard','certificate'),validation(Student.addStudent),StudentController.signUp);

// /api/student/:id
router
  .route("/:id")
  .get(  Token.authUserAndAdmin(['all']), StudentController.getStudentById)
  .put(Token.authUserAndAdmin(['all']) ,validation(Student.updateStudent), StudentController.updateStudent);


// /api/student/actions/:id
router.put("/actions/:id", Token.authAdmin(['all']),  validation(Student.actionsStudent), 
          StudentController.actionsStudent);

// /api/student/profile/info
router.get("/profile/info",Token.verifyToken, StudentController.studentInfo);

// /api/student/profile/waiting
router.get("/profile/waiting",Token.verifyToken, StudentController.studentWaiting);

// /api/student/profile/rejected
router.get("/profile/rejected",Token.verifyToken, StudentController.studentRejected);

// /api/student/profile/registration
router.get("/profile/registration",Token.verifyToken, StudentController.studentRegistration);

// /api/student/profile/accepted
router.get('/profile/accepted',Token.verifyToken, StudentController.studentAccepted);





module.exports = router;
