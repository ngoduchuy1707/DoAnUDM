var router = global.router;
let comment = require("../models/Comment");
var mongoose = require("mongoose");
let fs = require("fs");
const {isAuth} = require('../controller/authencation.controller');
/* GET users listing. */

var controller = require("../controller/comment.controller");

router.post("/insert_cmt", controller.insertComment);

router.get("/list_cmt", controller.listComment);

// xuat san pham theo id
router.get("/get_cmt_id/:id", controller.getCommentId);


router.put("/update_cmt", controller.updateComment);

router.delete("/delete_cmt", controller.deleteComment);

module.exports = router;