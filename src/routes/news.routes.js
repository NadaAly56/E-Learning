const express = require("express");
const router = express.Router();
const NewsController = require("../controllers/news.controller");
const News= require('../validations/news.validation');
const validation = require('../middlewares/validation');
const fileUpload = require("../utils/fileUpload");
const Token = require("../middlewares/verifyToken");



// /api/news
router.post("/",Token.authAdmin(['all']) ,fileUpload('imageCover') ,validation(News.addNews) ,NewsController.addNews);

// /api/news
router.get("/", NewsController.getAllNews)

// /api/news/:id
router.put("/:id",Token.authAdmin(['all']) ,fileUpload('imageCover') ,validation(News.updateNews) ,NewsController.updateNews);

// /api/news/:id
router.get("/:id", NewsController.getNewsById);



module.exports = router;
