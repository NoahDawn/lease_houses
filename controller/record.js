//防输入型攻击注入
const xss = require('xss')
const { exec } = require('../db/mysql.js')

//获取列表
// const getList = async (owner, keyword) => {
//     //where 1=1用于为后续添加的查询条件做连接
//     let sql = `select * from housems where 1=1 `
//     if (owner) {
//         sql += `and owner='${owner}' `
//     }
//     if (keyword) {
//         sql += `and location like '%${keyword}%' `
//     }
//     sql += `order by id desc `
//     return await exec(sql)
// }

//是否存在
const isExit = async function (myId, houseId) {
    const sql = `select * from records where myId='${myId}' and houseId='${houseId}' `
    const rows = await exec(sql)
    return rows[0]
}

//详情获取
const getDetail = async (id) => {
    const sql = `select * from housems where id='${id}' `
    const rows = await exec(sql)
    return rows[0]
}

//新增浏览记录
const addRecord = async (recordData = {}) => {
    const myId = recordData.myId
    const houseId = recordData.houseId
    const createtime = recordData.createtime

    const sql = `insert into records (myId, houseId, time)
                 values ('${myId}', '${houseId}', '${createtime}') `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

//更改浏览记录的时间
const updateRecord = async (id, updatetime) => {
    const sql = `update records set time='${updatetime}' where id='${id}' `

    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

module.exports = {
    // getList,
    isExit,
    getDetail,
    addRecord,
    updateRecord
}