var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cmtSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
        },
        product_id: {
            type: String,
            require: true,
        },
        info: {
            type: String,
            require: true,
        },
        rating: {
            type: Object,
            require: true,
        },
        Create_date: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "Comment" }
);
module.exports = mongoose.model("Comment", cmtSchema);
