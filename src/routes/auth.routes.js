// const validation = require("../middlewares/validation.js");
const router = require("express").Router();
const AuthController  = require("../controllers/auth.controller");
const Token = require("../middlewares/verifyToken");
const validation = require("../middlewares/validation");
const Auth = require("../validations/auth.validation");
const {limiter} = require("../middlewares/limiter");
const emailAuth = require("../utils/emailAuth.js");




// /api/auth/login
router.post('/login',limiter(4,true),validation(Auth.login), AuthController.login)

// /api/auth/forgot-password'
router.post('/forgot-password', limiter(4,false) ,validation(Auth.email), AuthController.forgotPassword)

// /api/auth//reset-password/:id/:token
router.post('/reset-password/:id/:token',validation(Auth.setNewPassword), AuthController.resetPassword)

// /api/auth/change-password
router.post('/change-password',limiter(3,false),Token.verifyToken,validation(Auth.login), AuthController.changePassword)

// /api/auth/set-new-password/:id/:token
router.put('/set-new-password/:id/:token',Token.authUserAndAdmin(['all']),validation(Auth.setNewPassword), AuthController.setNewPassword)

// /api/auth/confirm/:token
router.get('/confirm/:token', Token.verifyEmailToken , AuthController.confirmEmail)



module.exports = router;
