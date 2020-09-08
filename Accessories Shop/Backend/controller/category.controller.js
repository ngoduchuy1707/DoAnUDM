var router = global.router;
let category = require('../models/Category');
let product = require('../models/Product');
var mongoose = require("mongoose")

module.exports.insertCategory = function (req, res, next) {

    var key = {
        //name : new RegExp(req.query.name, "i")      
        // i la khong phan biet chu hoa hay thuong  // chon co ki tu trung
        name: new RegExp('^' + req.body.name.trim() + '$', "i")
        //chon dung ki tu 
    };
    category.find(key).limit(1).exec(function (err, pro) {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Err is ${err}`
            });
        }
        else {
            if (pro.length > 0) {

            }
            else {
                const newCategory = new category({
                    name: req.body.name,
                    des: req.body.des,
                })
                newCategory.save(function (err) {
                    if (err) {
                        res.json({
                            result: "failed",
                            data: {},
                            message: `Err is ${err}`
                        });
                    }
                    else {
                        res.json({
                            result: "successful",
                            data: {
                                name: req.body.name,
                                des: req.body.des,
                            },
                            message: "Insert category success"
                        });
                    };
                })
            }
        };
    })
};


module.exports.deleteCategory = (req, res, next) => {
    category.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.body.id) }, (err,user) => {
        if(err){
            res.json({
                result: false,
                message:`khong the xoa . loi ${err}`
            });
            return;
        }
        if(!user){
            res.json({
                result: false,
                message:"category khong ton tai"
            })
        }
        else {
            res.json({
                result: true,
                message:"xoa thanh cong"
            })
        }
    });
};

module.exports.listCategory = function (req, res, next) {  //xuat tat ca ds 

    category.find({}).limit().sort({ name: 1 }).select({
        name: 1,
        des: 1,
        Create_date: 1,
    }).exec(function (err, pro) {
        if (err) {
            res.json({
                result: false,
                data: [],
                message: `Err is ${err}`
            });
        }
        else {
            res.json({
                result: true,
                data: pro,
                count: pro.length,
                message: "Query list of category success"
            });
        };
    })
};

module.exports.getCategoryId =function(req, res, next) {   
    const {id = ''} = req.params; 
    category.findById(id,
    (err,pro)=>{
        console.log(err);
        if(err){
            res.json({
                result  : "failed",
                data    :[],
                message :`Err is ${err}`
            });
        }
        else{
            res.json({
                result  :"successful",
                data    : pro,
                message :"Query Id product success"
            });
        };
    })
  };


module.exports.updateCategory=function(req,res,next){
    let conditions = {}; // la 1 object
    if(mongoose.Types.ObjectId.isValid(req.body.id)==true){  //xac thuc thuoc tinh cua Oj
        conditions._id = mongoose.Types.ObjectId(req.body.id);
        let gtUdt = {};
        //update name
        gtUdt.name = req.body.name;
        gtUdt.des = req.body.des;
        
        const options = {
            new: true,   // tra ve du lieu da chuyen doi thay vi ban goc
            multi: true
        };
        category.findOneAndUpdate(conditions, {$set: gtUdt}, options, (err, updatedPr) => {
            if (err) {
                res.json({
                    result: false,
                    data: {},
                    message: `Can not update .Error is : ${err}`
                });
            } else {
                res.json({
                    result: true,
                    data:   updatedPr,
                    message: "Update successfully"
                });
            }
        })


    } else {
        res.json({
            result: "failed",
            data: {},
            messege: "Id khong dung"
        });
    }
    
};