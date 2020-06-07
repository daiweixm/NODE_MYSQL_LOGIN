const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./database/db')
db.sequelize.sync({ force: false })

const authMid = require('./middleware/auth')

// 单独模型同步
// const userModel = require('./models/User')
// userModel.sync({ force: false })

// parse application/x-www-form-urlencoded
// const uelencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/x-www-form-urlencoded
app.use(bodyParser.json())

// const jsonParser = bodyParser.json()

app.use(express.json())

const port = process.env.PORT || 5000

app.get('/',(req, res) => {
  res.send({ msg: 'Server is running.'})
})

const userRoute = require('./routes/User.route')
app.use('/api/v1/user', authMid(),userRoute)

// 登录模块
app.use('/api/v1/login',require('./routes/Login.route'))

// 注册模块
app.use('/api/v1/register',require('./routes/Register.route'))

app.listen(port, ()=>{
  console.log('Server is running at Port:' + port)
})