const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/db");

const Users = db.define(
    "users",
    {
        firstname: {
            type: DataTypes.STRING,
        },
        lastname: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,

        },
        number: {
          type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,

        },
        image: {
          type: DataTypes.STRING,

        },
        saldo: {
            type: DataTypes.NUMBER,

        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
)

module.exports = Users;