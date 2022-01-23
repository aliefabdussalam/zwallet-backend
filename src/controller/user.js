const usermodel = require("../model/user.model")
const { Sequelize } = require("sequelize")
const Op = Sequelize.Op;
const fs = require("fs");
const bcrypt = require("bcrypt");
const { success, failed, successLogin } = require("../helper/respon");

const users = {
    getAll : async (req, res) =>{
        try {
            const { query } = req;
            const search = query.search === undefined ? "" : query.search;
            const field = query.field === undefined ? "id" : query.field;
            const typeSort = query.sort === undefined ? "" : query.sort;
            const limit = query.limit === undefined ? 10 : parseInt(query.limit);
            const page = query.page === undefined ? 1 : query.page;
            const offset = page === 1 ? 0 : (page - 1) * limit;
            const result = await usermodel.findAll({
                where: {
                    firstName: {
                        [Op.like]: `%${search}%`,
                    },
                        
                    },
                offset,
                limit,
                field,
                typeSort,
                })
            success(res, result, 'Get All Users Success');
        } catch (error) {
            failed(res.json(401), 401, error);
        }
    },
    getDetail : async(req, res) =>{
        try {
            const iduser = req.params.id;
            const result = await usermodel.findAll({
                where: {
                id : iduser,
                },
            });
            success(res, result[0], "Get Details Users Success");
        } catch (error) {
            failed(res.status(401), 401, error);
        }
    },
    login: async (req, res) => {
        try {
            const { body } = req;
            const email = req.body.email;
            const cekEmail = await usermodel.findAll({
                where: {
                email,
                },
            });
            if (cekEmail.length <= 0) {
                failed(res.status(404), 404, "Email not Exist");
            } else {
                const passwordHash = cekEmail[0].password;
                bcrypt.compare(body.password, passwordHash, (error, checkpassword) => {
                    if (error) {
                        failed(res.status(404), 404, error);
                    } else if (checkpassword === true) {
                        const user = cekEmail[0];
                        const payload = {
                            id: user.id,
                        };
                        
                        successLogin(res, user, "Login Success");  
                    } else {
                        failed(res.status(404), 404, "Wrong Password");
                    }
                });
            }
        } catch (error) {
            failed(res.status(401), 401, error);
        }
    },
    register: async(req, res) =>{
        try {
            const { body } = req;          
            // const pinHash = bcrypt.hashSync(body.pin, 10)
            const email = req.body.email;
            const cekEmail = await usermodel.findAll({
                where: {
                    email,
                },
            });
            if(cekEmail.length <= 0){
                const passwordHash = bcrypt.hashSync(body.password, 10);
                const register = await usermodel.create({
                    firstname: body.firstname,
                    lastname: body.lastname,
                    email: body.email,
                    number: body.number,
                    password: passwordHash,
                    image: "default.png",
                    saldo: "0"
                });
                success(res, register, "Register Success");
            }else{
                failed(res.status(404), 101, "Email already Register");
            }
        } catch (error) {
            // console.log(error)
            failed(res.status(401), 401, error);
        }
    },
    update: async (req, res) => {
        try {
            const {
                firstname,
                lastname,
                email,
                number,
            } = req.body;
            const iduser = req.params.id;
            const Detail = await usermodel.findAll({
                where: {
                    id: iduser,
                },
            });
            const result = await usermodel.update(
                {
                    firstname,
                    lastname,
                    email,
                    number,
                    image: req.file ? req.file.filename : "default.png",
                },
                { where: {id: iduser},
            });
            if (Detail[0].image === "default.png") {
                success(res, result, "Update Data Success");
            } else {
                fs.unlink(`./upload/${Detail[0].image}`, (err) => {
                if (err) {
                    failed(res.status(500), 500, err);
                } else {
                    success(res, result, "Update Data Success");
                }
                });
            }
            } 
        catch (error) {
            failed(res.status(401), 401, error);
            console.log(error)
        }
    },
} 
module.exports = users;