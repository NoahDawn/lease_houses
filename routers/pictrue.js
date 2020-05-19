const router = require('koa-router') ()
const { SuccessModel, ErrorModel } = require('../model/resModel.js')

const fs = require('fs')
const path=require("path")

// 上传单个文件
router.post("/user", async function (ctx) {
    const file = ctx.request.files.pic; // 获取上传文件
    const userId = ctx.request.query.id || ''
    // file.name = 'picture_user_' + `${userId}`
    console.log('id is: ', userId)
    console.log('file is: ', file)
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let filePath = path.join(__dirname, 'picture/user') + `/${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    ctx.body = new SuccessModel()
    return
})

// router.post("/user", async (ctx) => {
//     const userId = ctx.request.query.id || ''
//     // file.name = 'picture_user_' + `${userId}`
//     console.log('id is: ', userId)
//     const file = ctx.request.files.file
//     const reader = fs.createReadStream(file.path)
//     let filePath = __dirname + "/picture/user/"
//     let fileResource = filePath + `/${file.name}`
//     if (!fs.existsSync(filePath)) {  //判断静态存储文件夹是否存在，如果不存在就新建一个  
//         fs.mkdir(filePath, (err) => {
//             if (err) {
//                 throw new Error(err) 
//             } else {
//                 let upstream = fs.createWriteStream(fileResource)
//                 reader.pipe(upstream)
//                 ctx.response.body = {
//                     url:uploadUrl + `/${file.name}`
//                 }  
//             }
//         })      
//     } else {
//         let upstream = fs.createWriteStream(fileResource)
//         reader.pipe(upstream)
//         ctx.response.body = {
//             url:uploadUrl+`/${file.name}` //返给前端一个url地址
//         }
//     }
// })

module.exports = {
    router
}