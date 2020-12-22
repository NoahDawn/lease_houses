const xss = require('xss')
const { exec } = require('../db/mysql.js')

const date = require('silly-datetime')

//获取news留言列表
const getNewsList = async (houseId) => {
    let sql = `select * from news where 1=1 `//注意空格
    if(houseId){
        sql += `and houseId='${houseId}' `
    }
    sql += `order by time desc;`

    return await exec(sql)
}
//获取reply回复列表
const getReplyList = async (newsId) => {
    let sql = `select * from reply where 1=1 `//注意空格
    if(newsId){
        sql += `and newsId='${newsId}' `
    }
    sql += `order by time desc;`

    return await exec(sql)
}
//留言
const newComment = async (commentData = {}) => {
    //commentData是一个评论对象，包含detail，myId等属性
    const detail = xss(commentData.detail)
    const author = commentData.author
    const time = date.format(new Date(),'YYYY-MM-DD HH:mm:ss')
    const myId = commentData.myId
    const houseId = commentData.houseId

    const sql = `insert into news (detail,author,time,myId,houseId) 
    values ('${detail}','${author}','${time}','${myId}','${houseId}') `

    const insertData = await exec(sql)
    return{
        id:insertData.insertId
    }
}
//回复
const Reply = async (replyData = {}) => {
    //replyData是一个评论对象，包含reply，myId等属性
    const reply = xss(replyData.reply)
    const newsId = replyData.newsId
    const time = date.format(new Date(),'YYYY-MM-DD HH:mm:ss')
    const myId = replyData.myId
    const houseId = replyData.houseId
    const author = replyData.author

    const sql = `insert into reply (reply,newsId,time,myId,houseId,author) 
    values ('${reply}','${newsId}','${time}','${myId}','${houseId}','${author}') `

    const insertData = await exec(sql)
    return{
        id:insertData.insertId
    }
}

module.exports = {
    getNewsList,
    getReplyList,
    newComment,
    Reply
}