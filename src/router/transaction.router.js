const express = require("express");

const{ getAll, topup, transfer, getIncome, getSpending }=require('../controller/transaction')

const transactionRouter = express.Router()

transactionRouter.get('/transaction', getAll)
.post('/topup', topup)
.post('/transfer/:id', transfer)
.get('/income', getIncome)
.get('/spending', getSpending)


module.exports = transactionRouter;