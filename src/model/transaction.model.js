const { Sequelize, DataTypes } = require("sequelize");
const connection = require("../config/db")
const usermodel = require('../model/user.model')

const Transaction = connection.define(
    "transaction",
    {
        amount: {
            type: DataTypes.INTEGER
        },
        balance: {
            type: DataTypes.INTEGER
        },
        type: {
            type: DataTypes.ENUM('transfer', 'topup')
        },
        note:{
            type: DataTypes.TEXT
        },
        sender:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        receiver:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: Sequelize.DATE
    },
    {
        freezeTableName: true,
        
    }
);
Transaction.belongsTo(usermodel, { as: "senderUsers", foreignKey: "sender" });
Transaction.belongsTo(usermodel, { as: "receiverUsers", foreignKey: "receiver" });

module.exports = Transaction