const models = require('../model/models')

const addGoods = async goods => {
  return new Promise((resolve, reject) => {
    let newGoods = models.goods(goods)
    newGoods.save((err, doc) => {
      if (err) reject(err)
      resolve(doc)
    })
  })
}

const findAllGoods = async () => {
  return new Promise((resolve, reject) => {
    models.goods.find({}, (err, doc) => {
      if (err) reject(err)
      resolve(doc)
    })
  })
}

const findOneGoods = async goodsId => {
  return new Promise((resolve, reject) => {
    models.goods.findOne({_id: goodsId}, (err, doc) => {
      if (err) reject(err)
      resolve(doc)
    })
  })
}

const saleGoods = async (goodsId, amount) => {
  return new Promise((resolve, reject) => {
    models.goods.updateOne({_id: goodsId}, {$inc: {stock: -amount, sale: amount}}, (err, doc) => {
      if (err) reject(err)
      resolve(doc)
    })
  })
}

const addView = async goodsId => {
  return new Promise((resolve, reject) => {
    models.goods.updateOne({_id: goodsId}, {$inc: {view: 1}}, (err, doc) => {
      if (err) reject(err)
      resolve(doc)
    })
  })
}

module.exports = {
  addGoods,
  findAllGoods,
  findOneGoods,
  saleGoods,
  addView
}
