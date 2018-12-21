const mongoose = require('mongoose')
const userSchema = require('../schema/user')
const goodsSchema = require('../schema/goods')

module.exports = {
  users: mongoose.model('UserModel', userSchema),
  goods: mongoose.model('GoodsModel', goodsSchema)
}
