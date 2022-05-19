const mongoose = require('mongoose');
//车的声明


// 车型表
var carSchema = mongoose.Schema({
    carType: String,//车类型名称
    carNumber: String,//车牌
    carSize: String,//车型大小
    carProof: String,//证件
    carState: Number,//车辆状态
    userId: String,
//    车型起步价
//    每公里价格
//    算距离


}, {
    timestamps: true////设置为true时会自动为我们添加两个新字段 createdAt和 updatedAt
})

var Car = mongoose.model('car', carSchema)

module.exports = Car;