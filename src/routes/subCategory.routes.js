const express = require("express");
const router = express.Router();
const validation = require("../middlewares/validation.js");
const subCategory = require('../validations/subCategory.validation.js');
const subCategoryController = require("../controllers/subCategory.controller");
const fileUpload = require("../utils/fileUpload");
const Token = require("../middlewares/verifyToken");

router.post("/",Token.authAdmin(['all']) ,fileUpload('image'), validation(subCategory.addSubCategory),subCategoryController.addSubCategory);

router.get("/", subCategoryController.getAllSubCategory);

router.get("/:id", subCategoryController.getSubCategoryById);

router.put("/:id",Token.authAdmin(['all']) , fileUpload('image'), validation(subCategory.updateSubCategory),subCategoryController.updateSubCategory);

module.exports = router;