const router = require('koa-router') ()
const { getList, newOrder, getOrderDetail, updateStatus, deleteOrder } = require('../controller/order.js')
const { getHouseDetail, updateCount } = require('../controller/house.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
// const loginCheck = require('../middleware/loginCheck.js')

//添加路由前缀
// router.prefix('/api/order')

//订单列表路由
router.get('/list', async function (ctx, next) {
    let myid = ctx.query.myid || ''
    //根据type的值筛选作为不同身份的订单列表
    let type = ctx.query.type || ''
    const listData = await getList(myid, type)
    ctx.body = new SuccessModel(listData)
})

//获取详情路由
router.get('/detail', async function (ctx, next) {
    const detailData = await getOrderDetail(ctx.query.id)
    ctx.body = new SuccessModel(detailData)
})

//新建订单路由
router.post('/new', async function (ctx, next) {
    const body = ctx.request.body
    const month = body.month
    let myid = ctx.query.myid || ''
    let houseid = ctx.query.houseid || ''
    const houseData = await getHouseDetail(houseid)
    const ownerid = houseData.ownerId
    const orderData = { renterId: myid, ownerId: ownerid, houseId: houseid, rentMonth: month }
    const newData = await newOrder(orderData)
    ctx.body = new SuccessModel(newData)
})

//更新订单确认态路由
router.post('/updatestatus', async function (ctx, next) {
    const id = ctx.query.id
    const myid = ctx.query.myid
    const type = ctx.query.type || ''     //身份类型
    const confirm = ctx.query.confirm || ''    //确认类型
    const updateValue = await updateStatus(id, myid, type, confirm)
    if (updateValue) {
        const theOrder = await getOrderDetail(id)
        //当双方都确认时修改该房源的已租赁用户数
        if (theOrder.renterState === 1 && theOrder.ownerState === 1) {
            //根据订单里的房源id获取该房源信息
            const houseData = await getHouseDetail(theOrder.houseId)
            //修改已租赁用户数
            updateCount(houseData.id, (houseData.rentCount) + 1)
            ctx.body = new SuccessModel('订单已被双方确认')
        }
        //当双方都取消订单时删除该订单信息
        if (theOrder.renterState === 2 && theOrder.ownerState === 2){
            deleteOrder(id)
            ctx.body = new SuccessModel('订单已取消')
        } 
    } else {
        ctx.body = new ErrorModel('更新状态失败')
    }
})

module.exports = {
    router
}