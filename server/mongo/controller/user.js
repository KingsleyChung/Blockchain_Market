const models = require('../model/models')

const findUser = username => {
  return new Promise((resolve, reject) => {
    models.users.findOne({username}, (err, doc) => {
      if (err) reject(err)
      resolve(doc)
    })
  })
}

const addUser = user => {
  return new Promise((resolve, reject) => {
    let newUser = models.users(user)
    newUser.save((err, doc) => {
      if (err) reject(err)
      resolve(doc)
    })
  })
}

const updateUser = (username, newUser) => {
  return new Promise((resolve, reject) => {
    models.users.updateOne({username}, {$set: {password: newUser.password, balance: newUser.balance, goods: newUser.goods}}, (err, doc) => {
      if (err) reject(err)
      resolve(doc)
    })
  })
}

module.exports = {
  findUser,
  addUser,
  updateUser
}
