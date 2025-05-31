const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
    },
    description:{
        type:String,
    },
    course:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }]
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;