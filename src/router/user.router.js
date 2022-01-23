const express = require('express');
const{
 login,register, getAll, getDetail, update
} = require('../controller/user');
const upload = require('../middleware/upload')


const userrouter = express.Router();
userrouter
.post('/login', login)
.post('/register', register)
.put('/user/:id', upload, update)
.get('/user/:id', getDetail)
.get('/user', getAll)

module.exports = userrouter;
