const express = require('express') // 引入express
const router = express.Router() // 创建一个Router实例
const Order = require('../model/order')

router.post('/addOrder', async (req, res) => {
    const { orderID, userID, driverID, startAddr, endAddr, orderDate, price, orderState, carName, cut } = req.body
    try {
        const inserDate = {
            orderID,
            userID,
            driverID,
            startAddr,
            endAddr,
            orderDate,
            price,
            orderState,
            carName,
            cut: cut || 0.1
        }
        await Order.create(inserDate)
        res.success('添加成功')
    } catch (e) {
        console.log(e);
        res.error('添加失败')
    }
})

router.post('/findOrderOne', async (req, res) => {
    const { orderID } = req.body
    try {
        const one = await Order.findOne({ orderID }, {
            createdAt: 0,
            cut: 0
        })
        res.success('查询成功', one)
    } catch (e) {
        res.error('查询失败')
    }
})

// 查询全部订单
router.post('/findOrderAll', async (req, res) => {
    const { limit, page, ...where } = req.body
    const skip = (page - 1) * limit
    const reg = new RegExp(where.userID, 'i')
    if (where.userID) where.userID = { $regex: reg };
    try {
        const one = await Order.find(where, {}, {
            // limit,
            // page,
            // skip
        });
        const total = await Order.count(where)
               res.success('查询成功', one)
    } catch (e) {
        res.error('查询失败')
    }
})
router.post('/findUserID', async (req, res) => {
    const { userID } = req.body
    try {
        const one = await Order.find({ userID }, {
            createdAt: 0,
            cut: 0
        })
        res.success('查询成功', one)
    } catch (e) {
        res.error('查询失败')
    }
})
// 通过司机ID查询
router.post('/findDriverID', async (req, res) => {
    const { driverID } = req.body
    try {
        const one = await Order.find({ driverID }, {
            createdAt: 0,
            cut: 0
        })
        res.success('查询成功', one)
    } catch (e) {
        res.error('查询失败')
        console.log(e);
    }
})
router.post('/findOrderAll', async (req, res) => {
    const { limit, page, ...where } = req.body
    const skip = (page - 1) * limit;
    const reg = new RegExp(where.name, 'i');
    if (where.name) where.name = { $regex: reg };
    try {
        const one = await Order.find(where, {}, {
            limit,
            page,
            skip
        });
        const total = await Order.count(where);
        res.success('查询成功', { one, total })
    } catch (e) {
        res.error('查询失败')
    }
})

router.post('/findOrderByState', async (req, res) => {
    const { orderState } = req.body
    try {
        const one = await Order.find({ orderState }, {
            createdAt: 0,
            cut: 0
        })
        res.success('查询成功', one)
    } catch (e) {
        res.error('查询失败')
    }
})

router.post('/deletOrder', async (req, res) => {
    const { orderID, userID } = req.body
    try {
        const one = await Order.findOne({ orderID, userID })
        if (!one) return res.error('订单号或者用户id有错')
        await Order.findOneAndRemove({ orderID, userID })
        res.success('删除成功')
    } catch (e) {
        res.error('删除失败')
    }
})

router.post('/updataOrder', async (req, res) => {
    const { orderID, userID, driverID, startAddr, endAddr, orderDate, orderState, carName, id } = req.body
    try {
        const yonghu = driverID ? driverID : userID
        const one = await Order.findOne({ orderID, yonghu })
        if (!one) return res.error('输入内容有误')
        await Order.findOneAndUpdate({ orderID, yonghu }, {
            startAddr: startAddr === '' ? one.startAddr : startAddr,
            endAddr: endAddr === '' ? one.endAddr : endAddr,
            orderDate: orderDate === '' ? one.orderDate : orderDate,
            orderState: orderState === '' ? one.orderState : orderState,
            carName: carName === '' ? one.carName : carName
        })
        res.success('修改成功')
    } catch (e) {
        res.error('修改失败')
    }
})


module.exports = router
