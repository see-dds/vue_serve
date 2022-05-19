const express = require('express') // 引入express
const router = express.Router() // 创建一个Router实例
const admin = require('../model/admin')
const util = require('utility')
const Logs = require('../model/logs')
const group = require('../model/group')
const role = require('../model/role')

//引入jwt实现 token 加密
const jwt = require('jsonwebtoken');

// 添加用户 用户自主注册
router.post('/addAdmin', async (req, res) => {
    const {phone, pwd, name} = req.body;
    if (!name || !pwd || !phone) return res.error('缺少必要参数')
    if (!/^1[2-9]\d{9}$/.test(phone)) return res.error('请填写正确的手机号码')

    try {
        // 判断昵称是否存在存在 - 不允许重复创建
        const u = await admin.findOne({
            phone
        })
        if (u) return res.error("当前用户已经存在，不能重复注册")

        //查询所有已经注册的用户 - 获得ID
        const ID = (await admin.find()).length + 10000
        const newuser = await admin.create({
            name,
            phone,
            pwd,
            ID
        })
        await newuser.update({groupID: '624f9021e8264bd929f05cdb'})

        res.success("注册成功")

    } catch (e) {
        res.error('注册失败')
    }
})

// 用户登录
router.post('/login', async (req, res) => {
    const {phone, pwd} = req.body
    if (!phone) return res.error('用户名不能为空')
    if (!pwd) return res.error('密码不能为空')
    try {
        const u = await admin.findOne({phone});
        // 加密token
        // req.sign( { uid:u._id }) - 加密cookie
        const token = req.sign({uid: u._id})
        //检验密码是否正确
        if (!u) return res.error("用户名或者密码不正确")
        if (pwd === u.pwd) {
            // 传输数据跟token
            res.success( "登录成功",  token)
        } else {
            res.error("用户名或者密码不正确")
        }
    } catch (e) {
        console.log(e)
        res.error("用户名或者密码不正确")
    }
})

// 全部查询（手机号/姓名）
router.post('/getAdmin', async (req, res) => {
    const {page = 1, limit = 10, ...where} = req.body
    const skip = (page - 1) * limit
    const reg = new RegExp(where.name, 'i')
    if (where.name) where.name = {$regex: reg}
    // const admins = await admin.find(where, {}, {skip, limit})
    // const count = await admin.count(where)
    // res.success('查询成功', {admins, count})
    // 聚合查询
    const admins = await admin.aggregate([
        {
            $match: where
        },
        {
            $project: {
                name: 1,
                pwd: 1,
                phone: 1,
                state: 1,
                groupID: {$toObjectId: "$groupID"},
                groupInfo: 1,

                // groupInfo: '$groupInfo'
            }
        },
        {
            //关联的表
            $lookup: {
                from: 'groups',// 外部去关联那个表
                localField: 'id',// 用group表当中哪个字段去关联
                foreignField: 'groupID',// 对应的外键字段
                as: 'groupInfo'// 查询出来的结果 别名
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
    ])
    const _res = admins.map(item => {

        return {
            _group: item.groupInfo.find(it => it._id.toString() == item.groupID).name,
            name: item.name,
            groupID: item.groupID,
            phone: item.phone,
            state: item.state,
            pwd: item.pwd,
            _id: item._id
        }
    })

    const count = await admin.count(where)
    // console.log(admins)
    res.success('查询成功', {_res, count})
})

// 单个查询
router.post('/getAdminOne', async (req, res) => {
    const {phone} = req.body
    try {
        //   const token = req.decode.uid
        const one = await admin.findOne({phone});
        console.log(one)
        res.success('查询成功',one)
    } catch (e) {
        console.log("e1", e)
        res.error('查询失败')
    }
})

//管理员信息修改
router.post('/updateAdmin', async (req, res) => {
    const {id, ...updateData} = req.body
    try {
        const u = await admin.findByIdAndUpdate(id)
        if (!u) return res.error('用户不存在')
        await admin.findByIdAndUpdate(id, updateData)
        res.success('修改成功')
    } catch (e) {
        console.log(e)
        res.error('修改信息失败')
    }
})

// 用户删除
router.post('/delete', async (req, res) => {
    const {id} = req.body;
    try {
        await admin.findByIdAndDelete(id);
        res.success('删除成功')

    } catch (e) {
        res.error('删除失败')
    }
})


//管理员进入后台
router.post('/addlogs', async (req, res) => {
    const {admindId, action} = req.body
    try {
        await Logs.create({
            admindId: admindId,
            action: action,
        })
        res.success('成功')
    } catch (e) {
        console.log(e)
        res.error('错误信息')
    }
})

//查看某管理员的日志操作
router.post('/checklogs', async (req, res) => {
    //根据管理员id进行查询
    const admindId = req.body
    try {
        const u = await Logs.find(admindId)
        res.success( '成功', u)
    } catch (e) {
        console.log(e)
        res.error('错误信息')
    }
})

//查看所有管理员的日志操作
router.post('/checkalllogs', async (req, res) => {
    try {
        //获取所有的日志
        const u = await Logs.find()
        res.success('成功',  u)
    } catch (e) {
        console.log(e)
        res.error('错误信息')
    }
})

//删除日志操作
router.post('/deletelogs', async (req, res) => {
    //根据日志id进行删除
    const id = req.body
    try {
        await Logs.findByIdAndRemove(id)
        res.success('成功')
    } catch (e) {
        console.log(e)
        res.error('错误信息')
    }
})

//修改日志操作
router.post('/updatelogs', async (req, res) => {
    //根据日志id进行删除
    const {id, action} = req.body
    try {
        await Logs.findByIdAndUpdate(id, {
            action: action
        })
        res.success('成功')
    } catch (e) {
        console.log(e)
        res.error('错误信息')
    }
})

// 添加角色
router.post('/addRole', async (req, res) => {
    const {name, des} = req.body
    const where = {}
    if (name) where.name = name
    if (des) where.des = des
    try {
        const one = await group.findOne({name})
        if (one) {
            res.error('该角色已经存在，请重新添加')
        } else {
            await group.create(where)
            res.success('成功')
        }
    } catch (e) {
        res.error('失败')
    }
})

// 查询全部角色（手机号/姓名）
router.post('/getRoles', async (req, res) => {
    const {page = 1, limit = 10, ...where} = req.body
    const skip = (page - 1) * limit
    const reg = new RegExp(where.name, 'i')
    if (where.name) where.name = {$regex: reg}
    const rolelist = await group.find(where, {}, {skip, limit})
    const count = await group.count(where)
    // res.success({data: groups, count})
    res.success('查询成功', {rolelist, count})
})

//查询单个角色
router.post('/getOneRole', async (req, res) => {
    const {id} = req.body
    try {
        const one = await group.findById(id)
        res.success('成功', one)
    } catch (e) {
        res.error('失败')
    }
})

//修改角色
router.post('/updateRole', async (req, res) => {
    const {id, ...updateData} = req.body
    try {
        const u = await group.findByIdAndUpdate(id)
        if (!u) return res.error('角色不存在')
        await group.findByIdAndUpdate(id, updateData)
        res.success('修改成功')
    } catch (e) {
        console.log(e)
        res.error('修改信息失败')
    }
})

//删除角色
router.post('/roleDelete', async (req, res) => {
    const {id} = req.body;
    try {
        await group.findByIdAndDelete(id);
        res.success({info: '删除成功'})

    } catch (e) {
        res.error('删除失败')
    }
})

//添加权限
router.post('/addPermission', async (req, res) => {
    const {...data} = req.body
    try {
        const one = await role.findOne({name: data.name})
        if (one) {
            res.error('该权限已经存在，请重新添加')
        } else {
            await role.create(data)
            res.success('添加成功')
        }
    } catch (e) {
        res.error('失败')
    }
})

//查找全部权限
router.post('/getPermissions', async (req, res) => {
    const list = await role.find()
    // res.success({data: groups, count})
    res.success('查询成功', list)
})


module.exports = router
