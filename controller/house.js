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
    sql += `and state=0 order by id desc `
    return await exec(sql)
}

//详情获取
const getHouseDetail = async (id) => {
    const sql = `select * from housems where id='${id}' `
    const rows = await exec(sql)
    return rows[0]
}

//新建房源
const newHouse = async (houseData = {}) => {
    const houseName = xss(houseData.houseName)
    const houseType = houseData.houseType
    const location = xss(houseData.location)
    const direction = houseData.direction
    const floor = xss(houseData.floor)
    const roomType = xss(houseData.roomType)
    const rent = xss(houseData.rent)
    const owner = houseData.owner
    const ownerId = houseData.ownerId
    const phone = xss(houseData.phone)
    const detail = xss(houseData.detail)

    const sql = `insert into housems (houseName, houseType, location, direction, floor, 
                                      roomType, rent, owner, ownerId, phone, detail)
                 values ('${houseName}', '${houseType}', '${location}', '${direction}', '${floor}', 
                         '${roomType}', '${rent}', '${owner}', '${ownerId}', '${phone}', '${detail}') `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

//更改已租赁人数
const updateCount = async (id, count) => {
    const sql = `update housems set rentCount='${count}' where id='${id}' `

    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

//更改出租状态
const updateHouse = async (id, Type) => {
    const sql = `update housems set state=1 where id='${id}' `

    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

module.exports = {
    getList,
    getHouseDetail,
    newHouse,
    updateHouse,
    updateCount
}