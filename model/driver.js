// 司机
const mongoose = require('mongoose')


// 需要在使用mongoose.Schema 对于这个表的对应指定进行声明
var driverSchema = mongoose.Schema({
    driverNickName: String, //昵称
    driverRealName: String, //真实姓名
    idNum: Number,  //身份证
    phone: Number,  //手机号码
    pwd: String, //密码
    sex: String, //性别
    age: Number, //年龄
    drivingYear: String, //驾龄
    headImg: String, //头像
    tradeNumber: Number, //交易次数
    totalShipment: Number //发货总量
}, {
    timestamps: true // 设置为true会自动的帮我们添加及维护两个字段 createdAt  updatedAt
});


// mongoose.model(对应的是我们的数据库中哪个表，表的描述)
var Driver = mongoose.model('driver', driverSchema);


module.exports = Driver;