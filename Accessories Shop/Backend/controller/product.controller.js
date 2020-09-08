var router = global.router;
let product = require('../models/Product');
var mongoose = require("mongoose")
let fs = require('fs');

/* GET users listing. */


module.exports.insertProduct = function (req, res, next) {
    const newProd = new product({
        name: req.body.name,
        kind: req.body.kind,
        price: req.body.price,
        image_name: req.body.image_name,
        amount: req.body.amount,
        status: req.body.status,
        details: req.body.details,

    });
    newProd.save(function (err) {
        if (err) {
            res.json({
                success: false,
                data: {},
                message: `Err is ${err}`
            });
        }
        else {
            res.json({
                success: true,
                data:
                {
                    name: req.body.name,
                    kind: req.body.kind,
                    price: req.body.price,
                    image_name: req.body.image_name,
                    create_date: req.body.create_date,
                    amount: req.body.amount,
                    status: req.body.status,
                    details: req.body.details,

                },
                message: "Insert product success"
            });
        };
    })

};

module.exports.listProduct = function (req, res, next) {  //xuat tat ca ds san pham
    product.find({}).limit().sort({ price : 1 }).select({
        name: 1,
        kind: 1,
        price: 1,
        Create_date: 1,
        status: 1,
        image_name: 1,
        amount: 1,
        details: 1,
        create_date: 1,
    }).exec(function (err, pro) {
        if (err) {
            res.json({
                result: false,
                data: [].sort(),
                message: `Err is ${err}`
            });
        }
        else {
            res.json({
                result: true,
                data: pro,
                count: pro.length,
                message: "Query list of product success"
            });
        };
    })
};

// xuat san pham theo id
module.exports.getProductId = function (req, res, next) {
    const { id = '' } = req.params;

    product.findById(id,
        (err, pro) => {
            console.log(err);

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
                    data: pro,
                    message: "Query Id product success"
                });
            };
        })
};


// xuat san pham theo tu khoa tim kiem
module.exports.findKey = function (req, res, next) {
    if (!req.query.name) {
        res.json({
            result: "failed",
            data: [],
            message: "Name khong hop le"
        })
    };
    var key = {
        name: new RegExp(req.query.name, "i")
    };
    product.find(key).limit(50).sort({ name: 1 }).select({
        name: 1,
        kind: 1,
        price: 1,
        Create_date: 1,
        status: 1,
        image_name: 1,
    }).exec(function (err, pro) {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                massage: `Err is ${err}`
            });
        }
        else {
            if (pro.length > 0) {
                res.json({
                    result: "successful",
                    data: pro,
                    count: pro.length,
                    message: "tim kiem thanh cong"
                });
            }
            else {
                res.json({
                    result: "failed",
                    data: [],
                    message: "sai ten tim kiem"
                });
            }
        };
    })
};


module.exports.updateProduct = function (req, res, next) {
    let conditions = {}; // la 1 object
    if (mongoose.Types.ObjectId.isValid(req.body.id) == true) {  //xac thuc thuoc tinh cua Oj
        conditions._id = mongoose.Types.ObjectId(req.body.id);
        let gtUdt = {};
        //update name
        gtUdt.name = req.body.name;
        gtUdt.price = req.body.price;
        gtUdt.kind = req.body.kind;
        gtUdt.status = req.body.status;
        gtUdt.image_name = req.body.image_name;
        gtUdt.amount = req.body.amount;
        gtUdt.details = req.body.details;
        const options = {
            new: true,   // tra ve du lieu da chuyen doi thay vi ban goc
            multi: true
        };
        product.findOneAndUpdate(conditions, { $set: gtUdt }, options, (err, updatedPr) => {
            if (err) {
                res.json({
                    result: false,
                    data: {},
                    massage: `Can not update .Error is : ${err}`
                });
            } else {
                res.json({
                    result: true,
                    data: updatedPr,
                    massage: "Update successfully"
                });
            }
        })


    } else {
        res.json({
            result: "failed",
            data: {},
            massage: "Id khong dung"
        });
    }

};

module.exports.deleteProduct = (req, res, next) => {
    product.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.body.id) }, (err, user) => {
        //console.log(_id)
        console.log(req.body.id);
        if (err) {
            res.json({
                result: false,
                massage: `khong the xoa . loi ${err}`
            });
            return;
        }
        if (!user) {
            res.json({
                result: false,
                massage: "san pham khong ton tai"
            })
        }
        else {
            res.json({
                result: true,
                massage: "xoa thanh cong"
            })
        }
    })
};


module.exports.uploadImages = (req, res, next) => {
    let formidable = require('formidable');
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024; //10 MB
    form.multiples = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.json({
                result: "failed",
                data: {},
                massage: `Cannot upload images.Error is : ${err}`
            });
        }

        var arrayOfFiles = [];
        if (files[""] instanceof Array) {
            arrayOfFiles = files[""];
        } else {
            arrayOfFiles.push(files[""]);
        }

        if (arrayOfFiles.length > 0) {
            var fileNames = [];
            arrayOfFiles.forEach((eachFile) => {
                // fileNames.push(eachFile.path)
                fileNames.push(eachFile.path.split('\\')[1]);
            });
            res.json({
                result: "ok",
                data: fileNames,
                numberOfImages: fileNames.length,
                massage: "Upload images successfully"
            });
        } else {
            res.json({
                result: "failed",
                data: {},
                numberOfImages: 0,
                massage: "No images to upload !"
            });
        }
    });
};

module.exports.openImage = (req, res, next) => {
    let imageName = "uploads/" + req.query.image_name;
    fs.readFile(imageName, (err, imageData) => {
        if (err) {
            res.json({
                result: "failed",
                massage: `Cannot read image.Error is : ${err}`
            });
            return;
        }
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(imageData); // Send the file data to the browser.
    });
};

