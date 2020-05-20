//防输入型攻击注入
const xss = require('xss')
const { exec } = require('../db/mysql.js')

//获取列表
const getList = async (typeid, type) => {
    //租户获取订单列表
    let sql = ``
    if (type === 'renter') {
        sql += `select * from orders where renterId='${typeid}' order by id desc `
    }
    //户主获取订单列表
    if (type === 'owner') {
        sql += `select * from orders where ownerId='${typeid}' order by id desc `
    }
    return await exec(sql)
}

//详情获取
const getOrderDetail = async (id) => {
    const sql = `select * from orders where id='${id}' `
    const rows = await exec(sql)
    return rows[0]
}

//新建订单
const newOrder = async (orderData = {}) => {
    const renterId = orderData.renterId
    const ownerId = orderData.ownerId
    const houseId = orderData.houseId
    const rentMonth = xss(orderData.rentMonth)
 
    const sql = `insert into orders (renterId, ownerId, houseId, rentMonth)
                 values ('${renterId}', '${ownerId}','${houseId}', '${rentMonth}') `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

//更改确认态
const updateStatus = async (id, myid, type) => {
    //租户确认订单
    let sql = ``
    if (type === 'renter') {
        sql += `update orders set renterState='1' where id='${id}' and renterId='${myid}' `
    }
    //房主确认订单
    if (type === 'owner') {
        sql += `update orders set ownerState='1' where id='${id}' and ownerId='${myid}' `
    }
    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

module.exports = {
    getList,
    getOrderDetail,
    newOrder,
    updateStatus
}