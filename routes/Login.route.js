const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userRouter = express.Router()

const userModel = require('../models/User')
process.env.SECRET_KEY = "secret"

userRouter.get('/test', (req, res) => {
  res.send(
    {
      msg: 'test user model'
    }
  )
})

// userRouter.post('/register', (req, res) => {
//   console.log(req.body)

//   const userData = {
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password
//   }

//   userModel.findOne({
//     where: { email: req.body.email}
//   })
//     .then((user) => {
//       if(!user) {
//         bcrypt.hash(req.body.password, 10, (err, hash) => {
//           userData.password = hash

//           userModel.create(userData)
//           .then((user) => {
//             res.json({
//               status : 'registered',
//               id: user.id
//             })
//           })
//             .catch(err => {
//               res.json({ error: err })
//             })
//         })
//       } else {
//         res.json({ error : "already exists"})
//       }
//     })
//       .catch(err => {
//         res.send('error:', err)
//       })
//   // res.send({'list':req.body})
// })

userRouter.post('/', (req, res) => {
  console.log(req.body)
  
  // authorization 验证
  // if(!req.header.authorization) {
  //   res.status(401).json({'msg': 'token过期，请重新登录！'})
  // }
  // authorization = req.headers.authorization
  // console.log('authorization:', authorization)
  // const token = String(req.headers.authorization || '').split(' ').pop()
  // const tokenData = jwtjwt.verify(token, process.env.SECRET_KEY)
  // const { id, email, iat, exp } = tokenData
  // console.log(id, email, iat, exp)
  // authorization 验证

  userModel.findOne({
    where: { email: req.body.email}
  })
    .then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, valid) => {
          console.log(valid)
          if (valid) {
            // 生成token
            let token = jwt.sign({
              id: user.id,
              email: user.email
            }, process.env.SECRET_KEY, {
              expiresIn: 60*20
            })
            res.status(200).json({
              'validate': true,
              'token': 'Bearer ' + token
            })
          } else {
            res.status(400).json({ 'validate': false })
          }
        })
      } else {
        res.status(400).json({ 'msg': 'no user founded.'})
      }
    })
      .catch(err=> {
        res.status(500).json({ 'error': err })
      })
  

  // res.send({ success: true})
})
module.exports = userRouter