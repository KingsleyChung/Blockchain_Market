const Koa = require('koa')
const serve = require('koa-static')
const koaBody = require('koa-body')
const path = require('path')
const jwtKoa = require('koa-jwt')
const mongoose = require('mongoose')
const routerController = require('./middleware/route_controller')
const paramsParser = require('./middleware/paramsParser')
const tokenError = require('./middleware/tokenError')

const app = new Koa()

app.use(serve(path.join(__dirname, './public')))
app.use(serve(path.join(__dirname, './dist')))
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024
  }
}))
app.use(paramsParser())
app.use(jwtKoa({secret: 'BlockChain'}).unless({
  path: [
    /^\/api\/login/,
    /^\/api\/register/,
    /^\/api\/upload\/image/,
    // /^\/api\/addGoods/, //
    // /^\/api\/allGoods/, //
    /^\/api\/goods*/, //
    /^\/api\/uploads/
  ]
}))
app.use(tokenError())
app.use(routerController())

mongoose.connect('mongodb://Kingsley:KingsleyChung132@139.199.59.246:27000/BlockChain_Market', err => {
  if (err) {
    console.log(`数据库连接失败:${err.message}`)
  } else {
    console.log(`数据库连接成功`)
  }
})

app.listen(3000, () => {
  console.log('Server running at port 3000 ...')
})
