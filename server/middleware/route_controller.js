const fs = require('fs')
const path = require('path')

function addMapping (router, mapping) {
  for (var url in mapping) {
    if (url.startsWith('GET ')) {
      let urlPath = url.substring(4)
      router.get(urlPath, mapping[url])
      console.log(`register URL mapping: GET ${urlPath}`)
    } else if (url.startsWith('POST ')) {
      let urlPath = url.substring(5)
      router.post(urlPath, mapping[url])
      console.log(`register URL mapping: POST ${urlPath}`)
    } else {
      console.log(`invalid URL: ${url}`)
    }
  }
}

function addControllers (router) {
  var files = fs.readdirSync(path.join(__dirname, '../routes'))
  var jsFiles = files.filter((f) => {
    return f.endsWith('.js')
  })

  for (var f of jsFiles) {
    console.log(`process route: ${f}...`)
    let mapping = require(path.join(__dirname, '../routes/' + f))
    addMapping(router, mapping)
  }
}

module.exports = function (dir) {
  let controllersDir = dir || 'routes' // 如果不传参数，扫描目录默认为'routes'
  let router = require('koa-router')()
  addControllers(router, controllersDir)
  return router.routes()
}
