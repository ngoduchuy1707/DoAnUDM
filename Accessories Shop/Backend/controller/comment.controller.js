var router = global.router;
let comment = require('../models/Comment');
var mongoose = require("mongoose")
let fs = require('fs');

module.exports.insertComment = function (req, res, next) {
    const newCmt = new comment({
        email:req.body.email,
        name: req.body.name,
        info: req.body.info,
        rating:req.body.rating,
        product_id:req.body.product_id
    });
    newCmt.save(function (err, comment) {
        if (err) {
            res.json({
                result: "failed",
                data: {},
                messege: `Err is ${err}`
            });
        }
        else {
            res.json({
                result: "successful",
                data: {
                    email:req.body.email,
                    name: req.body.name,
                    info: req.body.info,
                    rating:req.body.rating,
                    product_id:req.body.product_id,
                    Create_date: req.body.Create_date
                },
                message: "Insert comment success"
            });
        };
    })
};

module.exports.listComment = function (req, res, next) {  //xuat tat ca ds cmt
    comment.find({}).sort({ name: 1 }).select({
        email:1,
        name: 1,
        info: 1,
        rating:1,
        Create_date: 1,
        product_id:1
    }).exec(function (err, comment) {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Err is ${err}`
            });
        }
        else {
            res.json({
                result: "successful",
                count: comment.length,
                data: comment,
                message: "Query list of comment success"
            });
        };
    })
};


// xuat theo id
module.exports.getCommentId = function (req, res, next) {
    const { id = '' } = req.params;

    comment.findById(id,
        (err, comment) => {
            if (err) {
                res.json({
                    result: "failed",
                    data: [],
                    message: `Err is ${err}`
                });
            }
            else {
                res.json({
                    result: "successful",
                    data: comment,
                    message: "Query Id comment success"
                });
            };
        })
};

module.exports.updateComment = function (req, res, next) {
    let conditions = {}; // la 1 object
    if (mongoose.Types.ObjectId.isValid(req.body.id) == true) {  //xac thuc thuoc tinh cua Oj
        conditions._id = mongoose.Types.ObjectId(req.body.id);
    } else res.json({
        result: "failed",
        data: {},
        messege: "Id khong dung"
    });

    let gtUdt = {};
    if (req.body.name && req.body.name.length > 2) {
        gtUdt.name = req.body.name;
    }
    if (req.body.email && req.body.email.length > 2) {
        gtUdt.email = req.body.email;
    }
    if (req.body.info && req.body.info.length > 2) {
        gtUdt.info = req.body.info;
    }
    if (req.body.rating && req.body.rating.length > 2) {
        gtUdt.rating = req.body.rating;
    }

    const options = {
        new: true,   // tra ve du lieu da chuyen doi thay vi ban goc
        multi: true
    };
};

module.exports.deleteComment = (req, res, next) => {
    comment.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.body.id) }, (err, comment) => {
        if (err) {
            res.json({
                result: "failed",
                messege: `khong the xoa . loi ${err}`
            });
            return;
        }
        if (!comment) {
            res.json({
                result: "failed",
                messege: "Comment khong ton tai"
            })
        }
        else {
            res.json({
                result: "ok",
                messege: "xoa thanh cong"
            })
        }
    }
    )
};
