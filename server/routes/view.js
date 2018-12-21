const userDBController = require('../mongo/controller/user')
const goodsDBController = require('../mongo/controller/goods')

const addView = async ctx => {
  await goodsDBController.addView(ctx.params.goodsId)
  let user = await userDBController.findUser(ctx.user.username)
  if (!user.goods || !user.goods[ctx.params.goodsId]) {
    user.goods = {}
    user.goods[ctx.params.goodsId] = {
      amount: 0,
      view: 1,
      bought: 0
    }
  } else {
    user.goods[ctx.params.goodsId].view++
  }
  await userDBController.updateUser(ctx.user.username, user)
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

module.exports = {
  'GET /api/view': addView
}
