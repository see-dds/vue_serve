//用户组表
const mongoose = require('mongoose')

// 需要在使用mongoose.Schema 对于这个表的对应指定进行声明
var groupSchema = mongoose.Schema({
    name: String,//名字 超管，普通管理员
    des: String,//描述
    permission: Array,//权限0,101,102...
}, {
    timestamps: true // 设置为true会自动的帮我们添加及维护两个字段 createdAt  updatedAt
});


// mongoose.model(对应的是我们的数据库中哪个表，表的描述)
var group = mongoose.model('group', groupSchema);


module.exports = group;

