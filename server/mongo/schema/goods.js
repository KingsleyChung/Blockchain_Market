const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema(
  {
    title: String,
    stock: Number,
    price: Number,
    description: String,
    view: Number,
    sale: Number,
    filename: String
  },
  {
    timestamps: true,
    collection: 'goods'
  }
)
