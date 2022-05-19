// 用户 collection
const mongoose = require('mongoose')
// 需要在使用mongoose.Schema 对于这个表的对应指定进行声明
// 表的名称
// 里面是需要存储的内容
var adminSchema = mongoose.Schema({
    name: String, //账号
    pwd: String,//密码
    phone: Number,//手机
    groupID: String,//关联用户组ID，用户类型
    state: Number,//状态 0：禁用 1：启用
}, {
    timestamps: true // 设置为true会自动的帮我们添加及维护两个字段 createdAt  updatedAt
    // 两个字段表示了 创建时间 / 更新时间
});


// mongoose.model(对应的是我们的数据库中哪个表，表的描述)
var admin = mongoose.model('admin', adminSchema);

module.exports = admin;
