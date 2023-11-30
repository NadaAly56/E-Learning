const express = require("express");
const router = express.Router();
const validation = require("../middlewares/validation.js");
const Category = require('../validations/category.validation');
const categoryController = require("../controllers/category.controller");
const Token = require("../middlewares/verifyToken");


// /api/category/
router.route('/')
    .post(Token.authAdmin(['all']) ,validation(Category.addCategory),categoryController.addCategory )
    .get(categoryController.getAllCategory);

// /api/category/:id
router.put("/:id",Token.authAdmin(['all']) , validation(Category.updateCategory),categoryController.updateCategory);

// /api/category/:id
router.get("/:id",categoryController.getCategoryById);

module.exports = router;