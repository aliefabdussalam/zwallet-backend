const {Sequelize} = require("sequelize")

require('dotenv').config()

const connection = new Sequelize ('payment_app', process.env.db_username, process.env.db_password, {
    host : process.env.db_host,
    dialect : "mysql",
})

connection.authenticate()
.then(()=>{
    console.log("connect to db")
})
.catch((err)=>{
    console.log(err)
})
module.exports = connection