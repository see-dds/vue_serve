// 用户 collection
const mongoose = require('mongoose')


// 需要在使用mongoose.Schema 对于这个表的对应指定进行声明
var UserSchema = mongoose.Schema({
    userNickName: String,      // 用户昵称
    userRealName: String,    //真实姓名
    idNum: String,     //身份证号
    phone : Number,    //电话
    pwd : String,      //密码
    headImg: String,     //头像
    sex : Number,         //性别
    role : String,      //角色与行业
    urgent : Object,    //紧急联系人姓名
    emergency : Number,  //紧急联系人电话
    
},{
        timestamps: true // 设置为true会自动的帮我们添加及维护两个字段 createdAt  updatedAt
});


// mongoose.model(对应的是我们的数据库中哪个表，表的描述)
var User = mongoose.model('user', UserSchema)


module.exports = User;
