//防输入型攻击注入
const xss = require('xss')
const { exec } = require('../db/mysql.js')

//获取列表
const getList = async (author, keyword) => {
    //where 1=1用于为后续添加的查询条件做连接
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc `
    return await exec(sql)
}

//详情获取
const getDetail = async (id) => {
    const sql = `select * from blogs where id='${id}' `
    const rows = await exec(sql)
    return rows[0]
}

//新建博客
const newBlog = async (blogData = {}) => {
    //blogData是一个对象，包含一个博客的所有属性
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const author = blogData.author
    const createTime = Date.now()

    const sql = `insert into blogs (title, content, createtime, author)
                 values ('${title}', '${content}', '${createTime}', '${author}') `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

//更改博客
const updateBlog = async (id, blogData = {}) => {
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const sql = `update blogs set title='${title}', content='${content}' where id='${id}' `

    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

//删除博客
const deleteBlog = async (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}' `
    const deleteData = await exec(sql)
    if (deleteData.affectedRows > 0) {
        return true
    }
    return false
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}