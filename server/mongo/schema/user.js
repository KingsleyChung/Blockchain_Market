const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema(
  {
    username: String,
    password: String,
    balance: Number,
    goods: Object,
    recommands: Array
  },
  {
    timestamps: true,
    collection: 'users'
  }
)
