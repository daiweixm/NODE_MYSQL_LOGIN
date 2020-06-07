module.exports = options => {
  const jwt = require('jsonwebtoken')
  const UserModel = require('../models/User')
  const secret_key = require('./secret_key')
  return async(req, res, next) => {
    const authorization = req.headers.authorization
    if(!authorization) {
      return res.status(422).send({
        'msg': 'token不存在'
      })
    }

    const token = String(req.headers.authorization || ' ').split(' ').pop()
    if(!token) {
      return res.status(422).send({
        'msg': 'token不存在，请重新登录'
      })
    }

    const tokenData = jwt.verify(token, 'secret', async(err, decoded) => {
      

      if(err) {
        // 验证没有通过或已过期
        console.log('jwt verify error:', err)
        res.status(422).send({
          'err': err
        })
      } else {
        const id = decoded.id
        const email = decoded.email
        if (!id || !email) {
          return res.status(422).send({
            'msg': '无效的token'
          })
        }
        
        const { id: model_id } = await UserModel.findOne({
          where: { id: id }
        })

        res.user_id = model_id
        
        if(!model_id) {
          return res.status(401).send({
            'msg': '请先登录'
          })
        }
        next()
      }

      
    })
    // const { id, email, iat, exp } = tokenData

    // if (!id || !email || !iat || !exp) {
    //   return res.status(422).send({
    //     'msg': '无效的token'
    //   })
    // }

    // 查找user
    // const user = await UserModel.findOne({
    //   where: { id: id}
    // })
    // req.user = user
    // if(!req.user) {
    //   return res.status(401).send({
    //     'msg': '请先登录'
    //   })
    // }

    // next()
  }
}