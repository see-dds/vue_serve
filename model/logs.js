const mongoose = require('mongoose');

var logSchema = mongoose.Schema({
    admindId: String, //管理员的id
    action: String, //管理员进行的操作
},{
    timestamps : true////设置为true时会自动为我们添加两个新字段 createdAt和 updatedAt
})

var Logs = mongoose.model('Logs',logSchema)

module.exports=Logs;