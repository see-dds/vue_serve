const express = require('express');
const router = express.Router();
const article = require('../model/article.js')
//添加
router.post('/add', async (req, res) => {
    const {
        title,
        cate,
        content,
        cover,
    } = req.body;
    if (!title || !cate || !content || !cover) return res.error('缺少必要参数')
    const newuser = await article.create({
        title,
        cate,
        content,
        cover,
    })
    res.success( '添加成功')
})
//删除
router.post('/delete', async (req, res) => {
    const { id } = req.body;
    //  await  article.deleteOne({userName:'dixon' })  // 指定添加删除1个
    //  await article.deleteMany({userName:'dixon'}) // 指定条件删除多个
    await article.findByIdAndRemove(id)
    res.success('删除成功')

})
// 修改
router.post('/update', async (req, res) => {
    const {
        title,
        cate,
        content,
        cover,
        id
    } = req.body;

    const u = await article.findById(id);
    if (u) {
        const updateData = {};
        if (title) updateData.title = title;
        if (cate) updateData.cate = cate;
        if (content) updateData.content = content;
        if (cover) updateData.cover = cover;
        await article.findByIdAndUpdate(id, updateData)
        res.success('修改成功')
    } else {
        res.error('该信息不存在')
    }
})

// router.post('/update',async (req,res)=>{
//     const { id ,...updateData}  = req.body;
//     await Song.findByIdAndUpdate(id,updateData);
//     req.success();
// });


//根据id查询
router.post('/getId', async (req, res) => {
    const { id } = req.body;
    try {
        const one = await article.findById({ _id: id }, {
            createdAt: 0
        });
        res.success('查询成功',one)
    } catch (e) {
        res.error('查询失败')
        console.log(e);
    }

})
//根据标题查询
router.post('/getTitle', async (req, res) => {
    const { title } = req.body;
    try {
        const one = await article.find({ 'title': title }, {
            createdAt: 0
        });
        res.success('查询成功',one )
    } catch (e) {
        res.error('查询失败')
    }

})
//根据分类查询
router.post('/getCate', async (req, res) => {
    const { cate } = req.body;
    try {
        const one = await article.find({ 'cate': cate }, {
            createdAt: 0
        });
        res.success('查询成功',one )
    } catch (e) {
        res.error('查询失败')
    }

})
//根据内容查询
router.post('/getContent', async (req, res) => {
    const { content } = req.body;
    try {
        const one = await article.find({ 'content': content }, {
            createdAt: 0
        });
        res.success('查询成功', one )
    } catch (e) {
        res.error('查询失败')
    }

})
//查询所有信息
router.post('/getAll', async (req, res) => {
    const { page = 1, limit = 20, ...where } = req.body;


    const skip = (page - 1) * limit

    try {
        const data = await article.find(where, {

            createdAt: 0
        }, {
            limit,
            skip
        })

        const total = await article.count(where);
        res.success('成功',{
                rows: data,
                total
            })

    } catch (e) {
        res.error('获取错误')
    }

})
module.exports = router;
