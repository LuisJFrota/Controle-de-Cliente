const express = require('express')
const router = express.Router()

//Configuração banco
const mongoose = require("mongoose")
const bd = require("../db")
require("../models/User")
const User = mongoose.model("user")

const bcrypt = require('bcryptjs')
const passport = require("passport")

//Rotas 

router.get('/login', (req,res) => {
    res.render('index.ejs')
})

router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next)
})

router.get('/', (req, res) => {
    res.send("Pagina principal")
})

router.get('/register', (req,res) => {
    res.render('Register.ejs')
})

router.post('/register', (req,res) => {
    const userData = {
        name: req.body.name,
        lastName: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    }
    
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(userData.password, salt, (err, hash) => {
            if(err)
            {
                console.log("Erro ao encriptar senha")
            }

            userData.password = hash

            new User(userData).save().then(() => {
                console.log("Registrado com sucesso")
                res.redirect('/login')
            }).catch((err)=>{
                console.log("erro ao registrar")
            })
        })
    })
})

module.exports = router