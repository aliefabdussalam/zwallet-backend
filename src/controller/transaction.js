const { failed, success } = require('../helper/respon');
const Transaction = require('../model/transaction.model')
const usermodel = require('../model/user.model')
const { Sequelize } = require("sequelize")

const Op = Sequelize.Op;

module.exports = {
    getAll: async(req, res) => {
     try {
        const { iduser } = req.headers;
        const result = await Transaction.findAll({
            where: {
                [Op.or]: [{sender: iduser}, {receiver: iduser}]
            },
            include: [
                { model: usermodel, as: "senderUsers"},
                { model: usermodel, as: "receiverUsers"},
            ],
            order: [["id", "ASC"]],
        });
        success(res, result)
     } catch (error) {
         console.log(error)
        failed(res.status(404), 404, error);
     }
    },
    topup: async(req, res) => {
        try {           
            const { iduser } = req.headers;
            const getID= await usermodel.findAll({
                where: {
                    id : iduser,
                },
            })
            ;const saldo = getID[0].saldo

            const result = await Transaction.create({
            amount: req.body.amount,
            balance: req.body.amount + saldo,//saldo + amount
            type: "topup",
            note: req.body.note,
            sender: iduser,
            receiver: iduser
        });
        const update = await usermodel.update(
            {
                saldo : saldo + req.body.amount
            },  
            { where: { id: iduser } }
        );

        success(res, result, "top up berhasil")

        } catch (error) {
            console.log(error)
        }
        
    },
    transfer: async(req, res) => {
        try {           
            const { iduser } = req.headers;
            const receiverid = req.params.id;
            const senderID = await usermodel.findAll({
                where: {
                    id: iduser,
                },
            });
            const receiverID = await usermodel.findAll({
                where: {
                    id: receiverid,
                },
            });
            const saldo = senderID[0].saldo;
            const saldoReceiver = receiverID[0].saldo
            if (saldo < req.body.amount) {
                failed(res.status(404), 404, "saldo tidak mencukupi")
            } else {
                const result = await Transaction.create({
                    amount: req.body.amount,
                    balance: saldo - req.body.amount,
                    type: "transfer",
                    note: req.body.note,
                    sender: iduser,
                    receiver: receiverid
                });
                const update = await usermodel.update(
                    {
                        saldo: saldo - req.body.amount,
                    },
                    { where: {id : iduser} }
                )
                const updatereceiver = await usermodel.update(
                    {
                        saldo: saldoReceiver + req.body.amount
                    },
                    { where: {id : receiverid} }
                )
                success(res, result, "transfer berhasil")
            }

        } catch (error) {
            failed(error)
        }
        
    },
    getIncome: async(req, res) =>{
        try {
            const { iduser } = req.headers;
            const result = await Transaction.findAll({
                where: {
                    receiver: iduser
                }
            });
            success(res, result, "get Income Success")
        } catch (error) {
          // console.log(error)
            failed(res.status(401), 401, error);
        }
    },
    getSpending: async(req, res)=>{
        try {
            const { iduser } = req.headers;
            const result = await Transaction.findAll({
                where: {
                    sender: iduser,
                    type: "transfer"
                }
            });
            success(res, result, "get Spending Success ");
        } catch (error) {
            failed(res.status(401), 401, error);
        }
    },
    getAllTransaction: async(req, res) =>{
        try {
            const { iduser } = req.headers;
            const result = await Transaction.findAll({
                where: {
                    [Op.or] : [{sender: iduser}, {receiver: iduser}]
                },
                include: [
                    {model: usermodel, as: 'senderUsers'},
                    {model: usermodel, as: 'receiverUsers'}
                ]
            });
            success(res, result, "get all transaction success");
        } catch (error) {
            console.log(error)
            failed(res.status(401), 401, error);
        }
    }
}