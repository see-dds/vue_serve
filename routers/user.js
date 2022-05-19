const express = require('express') //引入express
const router = express.Router() //创建一个Router
const User = require('../model/user')
const util = require('utility')
const Address = require("../model/address")


// router.post('/addBdss', async (req, res) => {
//     const {userNickName, userRealName, idNum, phone, pwd, headImg, sex, role, urgent, emergency} =
//         req.body
//     if (!userNickName) return res.error('用户昵称不能为空')
//     if (!userRealName) return res.error('真实姓名不能为空')
//     if (!idNum) return res.error('请填写正确的身份证号码')
//     if (!sex) return res.error('性别不能为空')
//     if (!/^1[23456789]\d{9}$/.test(phone)) return res.error('请填写正确的联系电话')
//     if (!pwd) return res.error('密码不能为空')
//     if (!userNickName || !pwd || !userRealName || !idNum || !sex || !phone)
//         return res.error('缺少必要参数')
// // 增
// router.post('/addBdss', async (req, res) => {
//     const {userNickName, userRealName, idNum, phone, pwd, headImg, sex, role, urgent, emergency} =
//         req.body
//     if (!userNickName) return res.send('用户昵称不能为空')
//     if (!userRealName) return res.send('真实姓名不能为空')
//     if (!idNum) return res.send('请填写正确的身份证号码')
//     if (!sex) return res.send('性别不能为空')
//     if (!/^1[23456789]\d{9}$/.test(phone)) return res.send('请填写正确的联系电话')
//     if (!pwd) return res.send('密码不能为空')
//     if (!userNickName || !pwd || !userRealName || !idNum || !sex || !phone)
//         return res.send('缺少必要参数')
//     try {
//         // 先判断当前联系电话是否已经注册过用户
//         const u = await User.findOne({
//             phone,
//         })
//         if (u) return res.error('当前用户已经存在，不能重复注册')
//         // 如果没有 就开始执行添加操作
//         const newuser = await User.create({
//             userNickName,
//             userRealName,
//             idNum,
//             phone,
//             headImg,
//             sex,
//             role,
//             urgent,
//             emergency,
//             lastLoginDate: new Date(), //最后登录时间
//             lastIp: '', //最后登录ip
//             startD: {a: 1}, //开始地点
//             overD: {b: 2}, //结束地点
//         })
//         // 实现对于密码的md5加密
//         await newuser.update({pwd: util.md5(pwd + newuser.createdAt.getTime())})
//         res.success({info: '添加成功'})
//     } catch (e) {
//         console.log(e)
//         res.error('添加失败')
//     }
// })

//注册
router.post('/reg', async (req, res) => {
    const {userNickName, phone, pwd} = req.body
    if (!userNickName) return res.error('用户昵称不能为空')
    if (!/^1[23456789]\d{9}$/.test(phone)) return res.error('请填写正确的联系电话')
    if (!pwd) return res.error('密码不能为空')
    if (!userNickName || !pwd || !phone) return res.error('缺少必要参数')
    try {
        // 先判断当前联系电话是否已经注册过用户
        const u = await User.findOne({
            phone,
        })
        if (u) return res.error('当前用户已经存在，不能重复注册')
        // 如果没有 就开始执行添加操作
        const newuser = await User.create({
            phone,
            userNickName,
        })
        // 实现对于密码的md5加密
        await newuser.update({pwd: util.md5(pwd + newuser.createdAt.getTime())})
        res.success('添加成功')
    } catch (e) {
        console.log(e)
        res.error('添加失败')
    }
})

//用户登录
router.use('/login', async (req, res) => {
    const {phone, pwd, userNickName} = req.body
    if (!pwd) return req.error('密码不能为空')
    if (!/^1[23456789]\d{9}$/.test(phone)) return req.error('请填写正确的手机号码')
    try {
        const u = await User.findOne({phone});
        if (!u) return res.error('手机号或者密码错误');
        // 比对密码
        const curPwd = util.md5(pwd + u.createdAt.getTime())
        // 用密文去比对密文
        if (curPwd !== u.pwd) return res.error('手机号或者密码不正确');
        res.success('登录成功', u)
    } catch (e) {
        console.log(e)
        res.error('手机号或者密码不正确');
    }

})

//查看用户信息接口
router.post('/getall', async (req, res) => {
    const {id} = req.body;
    let song = await User.findById(id);
    try {
        res.success('成功',  song);
    } catch (e) {
        // console.log("错误提示", e)
        res.error('查询失败')
    }
})


//删除用户接口
router.post('/bdele', async (req, res) => {
    const {id} = req.body
    try {
        const u = await User.findById(id)
        await User.findByIdAndRemove(u)
        res.success( '删除成功')

    } catch (e) {
        console.log(e)
        res.error('删除失败')
    }
})

//修改用户信息接口
router.post('/tupdat', async (req, res) => {
    const {userNickName, userRealName, idNum, phone, pwd, headImg, sex, role, urgent, emergency, id} = req.body;
    // if (!/^1[23456789]\d{9}$/.test(phone)) return res.error('请填写正确的联系电话')
    try {
        const {id, ...updateData} = req.body;
        // const u = await User.findById(id);
        await User.findByIdAndUpdate(id, updateData);
        res.success('修改成功')
    } catch (e) {
        console.log(e)
        res.error('修改失败')
    }
})


//添加地址
router.post('/addD', async (req, res) => {
    const {uid, provivnce, remarks, linkMan, linkPone, tag} = req.body
    if (!uid) return res.error({info: '用户获取错误'})
    await Address.create(req.body)
    res.success( '操作成功')
})
//删除地址
router.post('/remD', async (req, res) => {
    const {uid, id} = req.body
    if (!uid) return res.error({info: '用户获取错误'})
    await Address.findByIdAndRemove(id)
    res.success('操作成功')
})
//修改地址
router.post('/upD', async (req, res) => {
    const {uid, id, ..._d} = req.body
    console.log(_d)
    await Address.findByIdAndUpdate(id, _d)
    res.success( '操作成功')
})
//获取用户所有的地址
router.post('/getD', async (req, res) => {
    const {uid} = req.body
    const see = await Address.find({uid: uid})
    res.success( '操作成功', see)
})

module.exports = router //导出router
