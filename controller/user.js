const { exec, escape } = require('../db/mysql.js')
const { genPassword } = require('../untils/cryp.js')
const xss = require('xss')

//用户登录
const login = async (username, password) => {
    username = escape(username)

    //生成加密密码
    password = genPassword(password)
    password = escape(password)

    const sql = `select id, username, realname from userms where username=${username} and password=${password} `
    const rows = await exec(sql)
    return rows[0] || {}
}

//用户注册
const register = async (userData = {}) => {
    //blogData是一个对象，包含一个博客的所有属性
    const username = xss(userData.username)
    const password = genPassword(xss(userData.password))
    const realname = xss(userData.realname)
    const phone = xss(userData.phone)

    const sql = `insert into userms (username, password, realname, phone)
                 values ('${username}', '${password}', '${realname}', '${phone}') `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

module.exports = {
    login,
    register
}