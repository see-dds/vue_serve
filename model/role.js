//角色表
const mongoose = require('mongoose')

// 需要在使用mongoose.Schema 对于这个表的对应指定进行声明
var roleSchema = mongoose.Schema({
    ps_id: Number,//权限id
    level: Number,//权限等级
    URL: String,//路径 user,order...
    name: String,//权限名字 用户管理100，用户列表110，添加用户111，编辑用户112...
    actions: String,//操作 增删改查...
    pid: Number,//上级id 用户管理：0 ，用户列表：100添加用户110，编辑用户110
}, {
    timestamps: true // 设置为true会自动的帮我们添加及维护两个字段 createdAt  updatedAt
});


// mongoose.model(对应的是我们的数据库中哪个表，表的描述)
var role = mongoose.model('role', roleSchema);


module.exports = role;

