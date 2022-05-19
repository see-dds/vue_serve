const express = require('express') // 引入express
const router = express.Router() // 创建一个Router实例
const Driver = require('../model/driver')
const util = require('utility')

//创建司机
// upload.single('shop_img'),
router.post('/register', async (req, res) => {
    const {
        driverNickName,
        driverRealName,
        idNum,
        phone,
        pwd,
        sex,
        age,
        drivingYear,
        headImg,
        tradeNumber,
        totalShipment,
    } = req.body

    // if (!driverNickName) return res.error('司机昵称不能为空')
    // if (!driverRealName || !idNum || !phone || !pwd || !sex || !age || !drivingYear || !tradeNumber || !totalShipment) return res.error('缺少必要参数')
    try {
        // const shop_img = req.file.path
        const u = await Driver.findOne({
            driverNickName,
        })
        if (u) return res.error('当前用户已经存在，不能重复注册')
        const u1 = await Driver.create({
            driverNickName,
            driverRealName,
            idNum,
            phone,
            pwd,
            sex,
            age,
            drivingYear,
            headImg,
            tradeNumber,
            totalShipment,
        })
        await Driver.findByIdAndUpdate(u1.id, {
            pwd: util.md5(pwd + u1.createdAt.getTime()),
        })

        res.success( '用户创建成功！')
    } catch (e) {
        console.log(e)
        res.error('用户创建失败！')
    }
})

// 登录
router.post('/login', async (req, res) => {
    const { phone, pwd } = req.body

    if (!/^1[232456789]\d{9}$/.test(phone)) return res.error('请填写正确的手机号')
    if (!pwd) return res.error('密码不能为空')
    try {
        const u = await Driver.create({
            phone,
        })
        await Driver.findByIdAndUpdate(u.id, {
            pwd: util.md5(pwd + u.createdAt.getTime()),
        })
        res.success('登录成功！')
    } catch (e) {
        // console.log(e);
        res.error('登录失败！')
    }
})

//修改司机密码
router.post('/changePwd', async (req, res) => {
    //传入新旧密码，不能为空，如果满足，查找对应的id，进行密码的替换。

    const { id, newPassword, rNewPassword, pwd } = req.body
    console.log(req.body)

    if (!pwd) return res.error('原密码为空')
    if (!id) return res.error('客户id为空')
    if (!newPassword) return res.error('新密码不能为空')
    if (!rNewPassword) return res.error('重复密码不能为空')
    if (!newPassword === rNewPassword) return res.error('两次密码输入不相等')

    try {
        const u1 = await Driver.findOne({
            _id: id,
        })
        if (!u1) return res.error('当前用户不存在，无法修改')

        await Driver.findByIdAndUpdate(id, {
            pwd: util.md5(pwd + u1.createdAt.getTime()),
        })

        res.success( '用户密码修改成功！')
    } catch (e) {
        console.log(e)
        res.error('用户密码修改失败！')
    }
})

//修改司机信息
router.post('/changemsg', async (req, res) => {
    //传入用户信息，不能为空，如果满足，查找对应的id，进行信息的替换。

    const { id, driverNickName, phone } = req.body
    console.log(req.body)

    if (!driverNickName) return res.error('修改的用户名不能为空')
    if (!phone) return res.error('修改的电话不能为空')
    if (!id) return res.error('修改的用户id不能为空')

    try {
        const u1 = await Driver.findOne({
            _id: id,
        })
        if (!u1) return res.error('当前用户不存在，无法修改')
        await Driver.findByIdAndUpdate(id, {
            driverNickName: driverNickName,
        })
        await Driver.findByIdAndUpdate(id, {
            phone: phone,
        })

        res.success( '用户信息修改成功！')
    } catch (e) {
        console.log(e)
        res.error('用户信息修改失败！')
    }
})

//查找司机
router.post('/findDriver', async (req, res) => {
    try {
        const one = await Driver.find()
        res.success('查询成功',one   )
    } catch (e) {
        res.error('查询失败')
    }
})
router.post('/findOneDriver', async (req, res) => {
    const { id } = req.body
    if (!id) return res.error('用户获取错误')
    const one = await Driver.findOne({_id:id})
    console.log('一个', one)
    res.success('查询成功', one  )
})

router.post('/remDriver',async(req,res)=>{
    const {id}=req.body
    if(!id) return res.error('用户获取错误')
    await Driver.findByIdAndRemove(id)
    res.success('删除成功')
})

module.exports = router
