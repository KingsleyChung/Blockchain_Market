const fs = require('fs')
const path = require('path')
const userDBController = require('../mongo/controller/user')
const goodsDBController = require('../mongo/controller/goods')

const uploadImage = async ctx => {
  console.log('upload image')
  const file = ctx.request.files.file // 获取上传文件
  if (file instanceof Array) {
    file.forEach((image) => {
      console.log(image)
      // 创建可读流
      const reader = fs.createReadStream(image.path)
      let filePath = path.join(__dirname, '../public/uploads') + `/${image.name}`
      // 创建可写流
      const upStream = fs.createWriteStream(filePath)
      // 可读流通过管道写入可写流
      reader.pipe(upStream)
    })
    ctx.body = '上传成功！'
  } else {
    // 创建可读流
    const reader = fs.createReadStream(file.path)
    let filePath = path.join(__dirname, '../public/uploads') + `/${file.name}`
    // 创建可写流
    const upStream = fs.createWriteStream(filePath)
    // 可读流通过管道写入可写流
    reader.pipe(upStream)
    ctx.body = {
      msg: '上传成功',
      code: 0,
      filename: file.name
    }
  }
}

const addGoods = async ctx => {
  ctx.params.goods.view = 0
  ctx.params.goods.sale = 0
  let res = await goodsDBController.addGoods(ctx.params.goods)
  ctx.body = {
    msg: 'success',
    code: 0,
    goods: res
  }
}

const allGoods = async ctx => {
  let goods = await goodsDBController.findAllGoods()
  ctx.body = {
    msg: 'success',
    code: 0,
    goods
  }
}

const oneGoods = async ctx => {
  let goods = await goodsDBController.findOneGoods(ctx.params.goodsId)
  ctx.body = {
    msg: 'success',
    code: 0,
    goods
  }
}

const buyGoods = async ctx => {
  let user = await userDBController.findUser(ctx.user.username)
  let goods = await goodsDBController.findOneGoods(ctx.params.goodsId)
  if (user.balance < goods.price * ctx.params.amount) {
    ctx.body = {
      msg: '余额不足',
      code: 2
    }
    return
  }
  if (goods.stock < ctx.params.amount) {
    ctx.body = {
      msg: '库存不足',
      code: 2
    }
    return
  }
  await goodsDBController.saleGoods(ctx.params.goodsId, ctx.params.amount)
  user.goods[ctx.params.goodsId].amount += ctx.params.amount
  user.goods[ctx.params.goodsId].bought += ctx.params.amount
  user.balance -= goods.price * ctx.params.amount
  await userDBController.updateUser(ctx.user.username, user)
  ctx.body = {
    msg: 'success',
    code: 0
  }
}

const recommandGoods = async ctx => {
  let user = await userDBController.findUser(ctx.user.username)
  let recommands = []
  if (user.recommands && user.recommands.length !== 0) {
    let recommandPromise = user.recommands.map((recommand) => {
      return goodsDBController.findOneGoods(recommand)
    })
    recommands = await Promise.all(recommandPromise)
  }
  ctx.body = {
    code: 0,
    recommands
  }
}

module.exports = {
  'POST /api/upload/image': uploadImage,
  'POST /api/addGoods': addGoods,
  'GET /api/allGoods': allGoods,
  'GET /api/goods': oneGoods,
  'GET /api/buyGoods': buyGoods,
  'GET /api/recommandGoods': recommandGoods
}
