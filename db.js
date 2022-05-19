const mongoose = require("mongoose");
// const initModels = require('./model/init-models')
const config = require('./config')

//连接数据库服务器
// mongodb:// 协议头
// 127.0.0.1 mongodb服务器的地址
// 27017 mongodb的端口

const { db_name,db_host,db_port} = config;

mongoose.connect(`mongodb://${db_host}:${db_port}/${db_name}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, function (error) {
  if (error) {
    console.log("数据库连接失败")
  } else {
    console.log("数据库连接成功")
  }
})

//导出
module.exports = mongoose;


// const sequelize = new Sequelize(db_name, db_username, db_pwd, {
//   host: db_host,
//   dialect: 'mysql',
//   define: {
//     underscored: false,
//     freezeTableName: true,
//     timestamps: true
//   },
// });
//
// module.exports = initModels(sequelize)
