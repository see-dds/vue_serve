const express = require('express');
const app = express();
const db = require('./db')
const config = require('./config')
const user = require('./model/user')
// session的使用
var session = require('express-session');
app.use(session({
    secret: 'qfedu',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 120 * 1000
    }
}))

//引入jwt实现 token 加密
const jwt = require('jsonwebtoken');

// 跨域 cors
const cors = require('cors')
app.use(cors()); // 解除cors跨域限制


// express 当中使用自带的json方法和urlencoded方法来解析body内容
app.use(express.urlencoded({extended: false})) // urlencoded
app.use(express.json()) // json


app.use((req, res, next) => {
    // 腾讯地图Key
    req.tenMapKey = config.tenMapKey;
    // 处理sequelize Model挂在在组件上
    req.model = {};
    for (const item in db) {
        /// 把首字母转成大写 做区别性 非必要 个人习惯而已
        const firstLetter = item.slice(0, 1).toUpperCase();
        const last = item.slice(1);
        const newName = firstLetter + last
        req.model[newName] = db[item]

    }
    next();
})

// 自定义一个error方法和一个success方法
app.use((req, res, next) => {

    res.error = (info, code) => {
        let _res = {
            success: false,
            info
        };
        if (code) _res.code = code;
        res.send(_res)
    }

    res.success = (info, data) => {
        let _res = {
            success: true
        };
        if (info) _res.info = info;
        if (data) _res.data = data;
        res.send(_res)
    }
    //  token 加密
    req.sign = (data) => {
        return jwt.sign(data, '123456')
    }

    // 如果req的headers当中有 authorization 然对 token 进行解密并传递到后面的中间件
    if (req.headers.authorization) {
        const {authorization} = req.headers;
        try {
            // 如果成功 直接吧解密的数据挂在到decode
            req.decode = jwt.verify(authorization, '123456')
        } catch (e) {
            // 如果token 检验失败 直接返回一个状态吗401
            return res.status(401).end();
        }
    }
    next()

})

// 设置静态文件
app.use('/public',express.static('assets')); //从 xxx:3000/abc/index.css

// const multer  = require('multer')
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './assets/upload')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+ '.'+file.originalname.split('.').pop();
//         cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
// })
// const upload = multer({ storage: storage })


// 各个路由的导入
const userRouter = require('./routers/user')   // 用户路由
const orderRouter = require('./routers/order') // 订单路由
const driverRouter = require('./routers/driver') // 司机路由
const articleRouter = require('./routers/article') // 文章路由
const adminRouter = require('./routers/admin') // 管理员路由
const car = require('./routers/car')//引入车
// 前台用户流程
app.use('/api/v1/user', userRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/driver', driverRouter)
app.use('/api/v1/article', articleRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/driver', car)
// // 上传图片
// app.use('/api/v1/upload', upload.any(), async (req,res)=>{
//     // console.log('file',req.files)
//     console.log('file',req.file)
// const filename = req.files[0].filename
//      res.send(`http://127.0.0.1:3000/public/upload/${filename}`)
// })

app.listen(3001, () => {
    console.log('srv is running at port 3001')
})
