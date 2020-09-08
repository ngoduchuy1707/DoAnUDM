var router = global.router;
let category = require("../models/Category");
let product = require("../models/Product");
var mongoose = require("mongoose");

var controller = require("../controller/category.controller");

router.post("/insert_category", controller.insertCategory);

router.delete("/delete_category", controller.deleteCategory);

router.put("/update_category",controller.updateCategory);

router.get("/list_category",controller.listCategory);

router.get("/get_category/:id", controller.getCategoryId);

module.exports = router;
