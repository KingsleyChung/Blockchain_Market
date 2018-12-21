const jwt = require('jsonwebtoken')
const userDBController = require('../mongo/controller/user')

const login = async ctx => {
  let user = await userDBController.findUser(ctx.params.username)
  if (!user) {
    ctx.body = {
      code: 2,
      msg: '用户不存在'
    }
    return
  }
  if (user.password !== ctx.params.password) {
    ctx.body = {
      code: 2,
      msg: '密码错误'
    }
    return
  }
  const userInfo = {username: ctx.params.username, password: ctx.params.password}
  const token = 'Bearer ' + jwt.sign(userInfo, 'BlockChain', {expiresIn: '8d'})
  ctx.body = {
    code: 0,
    userInfo: {
      token,
      username: ctx.params.username
    },
    msg: '登陆成功'
  }
}

const register = async ctx => {
  let user = await userDBController.findUser(ctx.params.username)
  if (user) {
    ctx.body = {
      code: 2,
      msg: '用户名已存在'
    }
    return
  }
  user = {
    username: ctx.params.username,
    password: ctx.params.password,
    balance: 100,
    records: null,
    recommands: []
  }
  user = await userDBController.addUser(user)
  const userInfo = {username: ctx.params.username, password: ctx.params.password}
  const token = 'Bearer ' + jwt.sign(userInfo, 'BlockChain', {expiresIn: '8d'})
  ctx.body = {
    code: 0,
    msg: '注册成功',
    userInfo: {
      token,
      username: ctx.params.username
    }
  }
}

module.exports = {
  'POST /api/login': login,
  'POST /api/register': register
}
