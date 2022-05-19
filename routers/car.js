const express = require('express') // 引入express
const router = express.Router() // 创建一个Router实例
const Car = require('../model/car') //引入表的声明
const Driver = require('../model/driver')
//添加车型
router.post('/addcar', async (req, res) => {
    const { carType, carNumber, carSize, carProof, carState, userId } = req.body
    if (!carType) return res.error('车辆类型不能为空')
    if (!carNumber) return res.error('车牌不能为空')
    if (!carSize) return res.error('车辆大小不能为空')
    if (!carProof) return res.error('车辆证件不能为空')
    if (!carState) return res.error('车辆状态必填')
    if (!userId) return res.error('车主必填')
    // if (!carState) return res.error('车辆状态必填')
    try {
        const newcar = await Car.create({
            carType,
            carNumber,
            carSize,
            carProof,
            carState,
            userId,
        })
        // await newUser.update({
        //     pwd: util.md5(pwd + newUser.createdAt.getTime()),
        // })
        res.success('车俩添加成功！')
    } catch (e) {
        console.log(e)
        res.error('车辆添加失败！')
    }
})
//用户删除车型
router.post('/removecar', async (req, res) => {
    const { id } = req.body
    console.log(id)
    if (!id) return res.error('车主必填')
    try {
        const newcar = await Car.findByIdAndRemove({
            _id: id,
        })

        res.success('车辆删除成功！')
    } catch (e) {
        console.log(e)
        res.error('车辆删除失败！')
    }
})
//商户修改车型
router.post('/updatecar', async (req, res) => {
    const { id, ...upcar } = req.body
    try {
        if (!id) res.error('车辆获取失败')
        console.log(upcar);
        await Car.findByIdAndUpdate(id, upcar)
        res.success('修改成功')
    } catch (e) {
        console.log(e)
        res.error('修改失败')
    }
})
//用户查车
router.post('/checkcar', async (req, res) => {
    const u = await Car.find()
    try {
        let driverMsg = await Car.aggregate([
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'id',
                    foreignField: 'userId',
                    as: 'driverInfo',
                },
            },
        ])
        res.success('成功', driverMsg)
    } catch (e) {
        res.error('查询失败失败')
    }
})

router.post('/findOneCar', async (req, res) => {
    const { id } = req.body
    if (!id) res.error('用户获取错误')
    const one = await Car.findOne({ _id: id })
    res.success('查询成功', one)
})
router.post('/searchCar',async(req,res)=>{
    const {...where}=req.body
    const reg = new RegExp(where.carType,'i')
    if(where.carType) where.carType = {$regex:reg}
    const ones = await Car.find(where,{})
    let driverMsg = await Car.aggregate([
        {
            $lookup: {
                from: 'drivers',
                localField: 'id',
                foreignField: 'userId',
                as: 'driverInfo',
            },
        },
    ])
    res.success('成功', {driverMsg,ones})
    // res.success('成功',ones)
})

module.exports = router
