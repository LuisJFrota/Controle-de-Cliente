const express = require('express')
const router = express.Router()

//Configuração banco
const mongoose = require("mongoose")
const bd = require("../db")
require("../models/User")
const User = mongoose.model("user")
require("../models/Shop")
const Shop = mongoose.model("shop")
require("../models/Client")
const Client = mongoose.model("client");

const sendMail = require("../sendEmail")

const bcrypt = require('bcryptjs')
const passport = require("passport")

const csv = require('csv-parser')
const fs = require('fs')
const results = []

const fileUpload = require('express-fileupload')

router.use(fileUpload())


//Rotas 

router.get('/login', (req,res) => {
    res.render('index.ejs')
})

router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '/dpregister',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next)
})

router.get('/', (req, res) => {    
    res.render("PagPrincipal.ejs");
})

router.get('/register', (req,res) => {
    res.render('Register.ejs')
})

router.get('/cadastrarempresa', (req,res) => {
    res.render('cadastrarEmpresa.ejs')
})

router.get('/contato', (req,res) => {
    res.render('Contato.ejs')
})

router.get('/emailmarketing', (req,res) => {
    res.render('emailmarketing.ejs')
})

router.get('/procurarusuario', (req,res) => {
    res.render('editarUsuario.ejs')
})

router.get('/editarusuario', (req,res) => {
    res.render('editarUsuario2.ejs')
})

router.get('/deletevalue/:id', (req,res) => {
    Client.findOneAndDelete({email: req.params.id}, (err, docs) => {
        
    })
    res.redirect('/empresa')
})


router.get('/empresa/:id', (req,res) => {
    Client.find({name: {$regex: '^' + req.params.id, $options: 'i'}}).exec((err,docs) => 
    {
        res.render('layoutEmpresa.ejs',{Usuarios:docs})
    })
})

router.get('/empresa', (req,res) => {
    Client.find().exec((err, docs) =>
    {
        res.render('layoutEmpresa.ejs',{Usuarios:docs})
    })  
})

router.get('/cadastrarcliente', (req,res) => {
    res.render('cadastrarCliente.ejs')
})

router.get('/dpregister', (req,res) => {
    res.render('afterRegister.ejs')
})

router.get('/sobre', (req,res) => {
    res.render('Sobre.ejs')
})

router.get('/enviaremail/:id', (req, res) =>
{
    var idlist = req.params.id
    
    sendMail.sendEmail(idlist)
    res.redirect("/empresa");
})

router.post('/cadcliente', (req,res) => {
    const clientData = {
        name: req.body.name,
        email: req.body.email,
        telefone: req.body.telefone,
        comprado: req.body.comp,
        nasc: req.body.data,
        city: req.body.cidade,
        state: req.body.estado
    }

    new Client(clientData).save().then(() => {
        console.log("Cliente registrado")
        res.redirect('/dpregister')
    }).catch((err) => {
        console.log("Erro ao registrar clientea")
    })
})

router.post('/uploadfile', (req,res) => {
    if(!req.files)
    {
        console.log("Arquivo não encontrado")
        return
    }

    let archive = req.files.file
    archive.mv(__dirname + "/arc.csv")
    
    fs.createReadStream(__dirname + "/arc.csv")
    .pipe(csv({separator: ';'}))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log(results)
        Client.insertMany(results).then(() => {
            console.log("Cliente registrado")
            res.redirect('/dpregister')
        }).catch((err) => {
            console.log("Erro ao registrar clientea")
        })
       
    })
})

router.post('/registershop', (req,res) => {
    const shopData = {
        name: req.body.name,
        cnpj: req.body.cnpj,
        tipoProduto: req.body.tipo,
        url: req.body.urlLoja,
        cidade: req.body.cidade,
        estado: req.body.estado,
        cpf: req.body.cpf,
        telefone: req.body.telefone,
        email: req.body.email
    }

    new Shop(shopData).save().then(() => {
        console.log("Loja registrada")
        res.redirect('/dpregister')
    }).catch((err) => {
        console.log("Erro ao registrar loja")
    })
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