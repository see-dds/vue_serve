const mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    orderID : String, // 订单号
    userID : String, // 客户id
    driverID : String, // 司机id
    startAddr : String, // 订单起始地点 起点
    endAddr : String, // 订单结束地点 目的地
    orderDate : String, // 预约时间 即订单开始进行时间
    price : Number, // 订单价格
    orderState : Number, // 订单状态 0 未开始 1 进行中 2 已完成 3 已取消
    carName : String, // 车辆类型
    cut : Number, // 平台抽成 可不写 默认值为0.1  0.1可修改
},{
    timestamps : true
})

var Order = mongoose.model('order',orderSchema)

module.exports = Order;