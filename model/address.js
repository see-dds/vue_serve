const mongoose = require('mongoose')

//地址表
var address = mongoose.Schema(
    {
        provivnce:String,
        remarks:String,
        linkMan:String,
        linkPone:Number,
        tag:String,
        uid:String,
    },
    {
        timestamps: true, ////设置为true时会自动为我们添加两个新字段 createdAt和 updatedAt
    }
)

var Address = mongoose.model('address', address)

module.exports = Address
