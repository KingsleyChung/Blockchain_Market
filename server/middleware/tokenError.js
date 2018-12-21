const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify)

/**
 * 判断token是否可用
 */
module.exports = () => {
  return async (ctx, next) => {
    try {
      // 获取jwt
      let token = ctx.header.authorization
      if (token) {
        try {
          // 解密payload，获取用户名和ID
          let payload = await verify(token.split(' ')[1], 'BlockChain')
          if (payload) {
            ctx.user = payload
          }
        } catch (err) {
          console.log('token verify fail: ', err)
        }
      }
      await next()
    } catch (err) {
      console.log(err)
      if (err.status === 401) {
        ctx.status = 401
        ctx.body = {
          success: 0,
          message: '认证失败'
        }
      } else {
        err.status = 404
        ctx.body = {
          success: 0,
          message: '404'
        }
      }
    }
  }
}
