//防输入型攻击注入
const xss = require('xss')
const { exec } = require('../db/mysql.js')

//获取列表
const getList = async (ownerId, keyword, pageType) => {
    //where 1=1用于为后续添加的查询条件做连接
    let sql = `select * from housems where 1=1 `
    if (ownerId) {
        sql += `and ownerId='${ownerId}' `
    }
    if (keyword) {
        sql += `and location like '%${keyword}%' `
    }
    if (pageType) {
        sql += `order by id desc `
    } else {
        sql += `and state=0 order by id desc `
    }
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
    const picture = 'http://101.200.134.15:8000/picture/house/DefaultAvatar.jpg'
    const allURL = picture + ';' + picture + ';' + picture

    const sql = `insert into housems (houseName, houseType, location, direction, floor, 
                                      roomType, rent, owner, ownerId, phone, detail, picture)
                 values ('${houseName}', '${houseType}', '${location}', '${direction}', '${floor}', 
                         '${roomType}', '${rent}', '${owner}', '${ownerId}', '${phone}', '${detail}', '${allURL}') `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

//填充图片路径
const pictureURL = async (id, picture) => {
    const sql = `update housems set picture='${picture}' where id='${id}' `

    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
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

//修改房源信息
const updateHouse = async (houseData = {}) => {
    const rent = xss(houseData.rent)
    const phone = xss(houseData.phone)
    const detail = xss(houseData.detail)
    const state = xss(houseData.state)
    const rentCount = xss(houseData.rentCount)

    const sql = `update housems set rent='${rent}', phone='${phone}', detail='${detail}', 
                                    state='${state}', rentCount='${rentCount}'
                 where id='${houseData.id}' and ownerId='${houseData.ownerId}' `
    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

//删除房源信息
const deleteHouse = async function(id, ownerId) {
    const sql = `delete from housems where id='${id}' and ownerId='${ownerId}' `
    const deleteData = await exec(sql)
    if (deleteData.affectedRows > 0) {
        return true
    }
    return false
}

module.exports = {
    getList,
    getHouseDetail,
    newHouse,
    pictureURL,
    updateHouse,
    updateCount,
    deleteHouse
}