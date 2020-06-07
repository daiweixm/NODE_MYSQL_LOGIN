const Sequelize = require('sequelize')
const db = {}

const sequelize = new Sequelize('exapp','remote','1Admin!123',{
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

// 测试链接
sequelize
  .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
      .catch(err => {
        console.error('Unable to connect to the database:', err)
      })

db.Sequelize = Sequelize
db.sequelize = sequelize

module.exports = db
