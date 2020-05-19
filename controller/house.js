//防输入型攻击注入
const xss = require('xss')
const { exec } = require('../db/mysql.js')

//获取列表
const getList = async (owner, keyword) => {
    //where 1=1用于为后续添加的查询条件做连接
    let sql = `select * from housems where 1=1 `
    if (owner) {
        sql += `and owner='${owner}' `
    }
    if (keyword) {
        sql += `and location like '%${keyword}%' `
    }
    sql += `order by id desc `
    return await exec(sql)
}

//详情获取
const getDetail = async (id) => {
    const sql = `select * from housems where id='${id}' `
    const rows = await exec(sql)
    return rows[0]
}

//新建房源
const newHouse = async (blogData = {}) => {
    //blogData是一个对象，包含一个博客的所有属性
    const houseName = xss(blogData.houseName)
    const houseType = blogData.houseType
    const location = xss(blogData.location)
    const direction = blogData.direction
    const floor = xss(blogData.floor)
    const roomType = xss(blogData.roomType)
    const rent = xss(blogData.rent)
    const owner = blogData.owner
    const phone = xss(blogData.phone)
    const detail = xss(blogData.detail)


    const sql = `insert into housems (houseName, houseType, location, direction, floor, 
                                      roomType, rent, owner, phone, detail)
                 values ('${houseName}', '${houseType}', '${location}', '${direction}', '${floor}', 
                         '${roomType}', '${rent}', '${owner}', '${phone}', '${detail}') `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

//更改博客
// const updateBlog = async (id, blogData = {}) => {
//     const title = xss(blogData.title)
//     const content = xss(blogData.content)
//     const sql = `update blogs set title='${title}', content='${content}' where id='${id}' `

//     const updateData = await exec(sql)
//     if (updateData.affectedRows > 0) {
//         return true
//     }
//     return false
// }

//删除博客
// const deleteBlog = async (id, author) => {
//     const sql = `delete from blogs where id='${id}' and author='${author}' `
//     const deleteData = await exec(sql)
//     if (deleteData.affectedRows > 0) {
//         return true
//     }
//     return false
// }

module.exports = {
    getList,
    getDetail,
    newHouse
    // updateBlog,
    // deleteBlog
}