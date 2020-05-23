const { exec, escape } = require('../db/mysql.js')
const { genPassword } = require('../untils/cryp.js')
const xss = require('xss')

//用户登录
const login = async (username, password) => {
    username = escape(username)

    //生成加密密码
    password = genPassword(password)
    password = escape(password)

    const sql = `select id, username, realname, picture from userms where username=${username} and password=${password} `
    const rows = await exec(sql)
    return rows[0] || {}
}

//用户注册
const register = async (userData = {}) => {
    const username = xss(userData.username)
    const password = genPassword(xss(userData.password))
    const realname = xss(userData.realname)
    const phone = xss(userData.phone)
    const picture = 'http://localhost:8000/static/picture/user/DefaultAvatar.jpg'

    const sql = `insert into userms (username, password, realname, phone, picture)
                 values ('${username}', '${password}', '${realname}', '${phone}', '${picture}') `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

//修改个人信息前先获得个人信息
const getUserDetail = async function(id) {
    const sql = `select username, realname, phone from userms where id='${id}' `
    const userData = await exec(sql)
    return userData[0] || {}
}

//个人设置
const updateUserMS = async (userData = {}) => {
    const id = userData.id
    const username = xss(userData.username)
    const realname = xss(userData.realname)
    const phone = xss(userData.phone)
    const picture = userData.picture

    const sql = `update userms set username='${username}', realname='${realname}',
                                   phone='${phone}', picture='${picture}'
                 where id='${id}' `
    const insertData = await exec(sql)
    return {
        id: id
    }
}

module.exports = {
    login,
    register,
    getUserDetail,
    updateUserMS
}