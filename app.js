const express = require('express')
const cors = require('cors')
const app = express()
const registerRoute = require('./src/router/user.router')
const orderRoute = require('./src/router/transaction.router')
const bodyParser = require('body-parser')

app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
app.use('/upload', express.static(`${__dirname}/upload`));
app.use(bodyParser.json())
app.use(registerRoute)
app.use(orderRoute)
app.listen(8080, () => {
    console.log('connect to 8080')
})

module.exports = app