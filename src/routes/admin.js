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
const clientArray = []

const {eAdmin} = require("../helpers/eAdmin")

const fileUpload = require('express-fileupload')

router.use(fileUpload())

//Rotas 

router.get('/login', (req,res) => {
    res.render('Login.ejs')
})

router.post('/login', (req, res, next) => {
    console.log(req.body.email + " " +req.body.senha)
    passport.authenticate("local", {
        successRedirect: '/logged',
        failureRedirect: '/',
        failureFlash: true
    })(req,res,next)
})

router.get('/', (req, res) => {    
    res.render("Landing_Page.ejs");
})

router.get('/register', (req,res) => {
    res.render('Register.ejs')
})

router.get('/cadastrarempresa', eAdmin, (req,res) => {
    res.render('cadastrarEmpresa.ejs', {Erros: []})
})

router.get('/contato', (req,res) => {
    res.render('Contato.ejs')
})

router.get('/emailmarketing', eAdmin, (req,res) => {
    res.render('emailmarketing.ejs')
})

router.get('/procurarusuario', eAdmin, (req,res) => {
    res.render('editarUsuario.ejs')
})

router.get('/editarusuario', eAdmin, (req,res) => {
    res.render('editarUsuario2.ejs')
})

router.get('/emailconfig', eAdmin, (req,res) => {
    res.render('searchbox.ejs')
})

router.get('/popup', (req,res) => {
    res.render('popup.ejs')
})

router.get('/deletevalue/:id', eAdmin, (req,res) => {
    Client.findOneAndDelete({email: req.params.id}, (err, docs) => {
        res.redirect('/empresa/'+docs.shop)
    }) 
})


router.get('/empresa/:id/:nome', eAdmin, (req,res) => {
    Client.find({name: {$regex: '^' + req.params.nome, $options: 'i'}}).exec((err,docs) => 
    {
        res.render('Empresa.ejs', {Usuarios:docs})
    })
})

router.get('/empresa/:id', eAdmin, (req,res) => {
    Client.find({shop: req.params.id}).exec((err, docs) =>
    {
        res.render('Empresa.ejs',{Usuarios:docs})
    })  
})

router.get('/cadastrarcliente', eAdmin, (req,res) => {
    Shop.find().exec((err, docs) => 
    {
        res.render('cadastrarCliente.ejs', {Empresas: docs})
    }) 
})

router.get('/logged', eAdmin, (req,res) => {
    Shop.find({user: req.session.passport.user._id}).exec((err, docs) => {
        res.render('Logged_Landing_page.ejs', {Shops: docs})
    })   
})

router.get('/enviaremail/:id', eAdmin, (req, res) =>
{
    var idlist = req.params.id
    
    fs.createReadStream(__dirname + "/template.html")
    .on('data', (data) => {
        console.log(data.toString('utf-8'))  
        sendMail.sendEmailTemplate(idlist, data.toString('utf-8'))
        //sendMail.sendEmail(idlist);
        res.redirect('/empresa')  
    })
})

router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/')
})

router.post('/cadcliente', eAdmin, (req,res) => {
    if(req.files)
    {
        let archive = req.files.file
        let filePath = __dirname + "/arc.csv"
    
        archive.mv(filePath)
           
        fs.createReadStream(__dirname + "/arc.csv")
        .pipe(csv({separator: ';'}))
        .on('data', (data) => {
            const arrayData = {
                name: data.name,
                email: data.email,
                telefone: data.telefone,
                comprado: data.comprado,
                nasc: data.nasc,
                city: data.city,
                state: data.state,
                shop: req.body.empresa
            }
            results.push(arrayData)
        })
        .on('end', () => {       
            Client.insertMany(results).then(() => {  
                res.redirect('/logged')
            }).catch((err) => {
                console.log("Erro ao registrar clientea")
            })   
        })
        return
    }

    console.log("Nao botou arquivo")

    const clientData = {
        name: req.body.name,
        email: req.body.email,
        telefone: req.body.telefone,
        comprado: req.body.comp,
        nasc: req.body.data,
        city: req.body.cidade,
        state: req.body.estado,
        cpf: req.body.cpf,
        shop: req.body.empresa
    }

    new Client(clientData).save().then(() => {
        console.log("Cliente registrado")
        
        res.redirect('/logged')
    }).catch((err) => {
        console.log("Erro ao registrar clientea")
    })
})

router.post('/uploadtemplate', eAdmin, (req,res) => {

    if(!req.files)
    {
        console.log("Arquivo não encontrado")
        return
    }

    let archive = req.files.file
    
    archive.mv(__dirname + "/template.html")   

    res.redirect('empresa')
})

router.post('/uploadfile', eAdmin, (req,res) => {
    

    
})

router.post('/registershop', eAdmin, (req,res) => {
    var erros = []

    //Validação nome
    if(!req.body.name || req.body.name == null || typeof req.body.name == undefined)
    {
        erros.push("Nome inválido")
    }
    else if(req.body.name.length < 5)
    {
        erros.push("Nome muito curto")
    }
    else if(req.body.name.length > 30)
    {
        erros.push("Nome muito longo")
    }
    //Validação produto
    if(!req.body.tipoProduto || req.body.tipoProduto == null || typeof req.body.tipoProduto == undefined)
    {
        erros.push("Produto inválido")
    }
    //Validação url
    if(!req.body.url || req.body.url == null || typeof req.body.url == undefined)
    {
        erros.push("url inválida")
    }
    //Validação cidade
    if(!req.body.cidade || req.body.cidade == null || typeof req.body.cidade == undefined)
    {
        erros.push("Nome da cidade inválida")
    }
    else if(req.body.cidade.length < 2)
    {
        erros.push("Nome da cidade muito curto")
    }
    else if(req.body.cidade.length > 25)
    {
        erros.push("Nome da cidade muito longo")
    }
    //Validação de estado
    if(!req.body.estado || req.body.estado == null || typeof req.body.estado == undefined)
    {
        erros.push("Nome do estado inválido")
    }
    else if(req.body.estado.length < 2)
    {
        erros.push("Nome do estado muito curto")
    }
    else if(req.body.estado.length > 25)
    {
        erros.push("Nome do estado muito longo")
    }
    //validação de cpf
    if(!req.body.cpf || req.body.cpf == null || typeof req.body.cpf == undefined
         || req.body.cpf.length > 11 || req.body.cpf.length < 11)
    {
        erros.push("Número de cpf inválido")
    }
    //Validação de telefone
    if(!req.body.telefone || req.body.telefone == null || typeof req.body.telefone == undefined
        || req.body.telefone.length > 11 || req.body.telefone.length < 11)
    {
        erros.push("Número de telefone inválido")
    }
   //validação de email
   if(!req.body.email || req.body.email == null || typeof req.body.email == undefined)
    {
    erros.push("Email inválido")
    }
    
    if(erros.length >  0)
    {
        res.render('cadastrarEmpresa.ejs',{Erros:erros})
        return
    }

    const shopData = {
        name: req.body.name,
        cnpj: req.body.cnpj,
        tipoProduto: req.body.tipoProduto,
        url: req.body.url,
        cidade: req.body.cidade,
        estado: req.body.estado,
        cpf: req.body.cpf,
        telefone: req.body.telefone,
        email: req.body.email,
        user: req.session.passport.user._id
    }

    new Shop(shopData).save().then(() => {
        console.log("Loja registrada")
        res.redirect('/logged')
    }).catch((err) => {
        console.log("Erro ao registrar loja")
    })
})

router.post('/register', (req,res) => {
    var erros = []

    //Validação do nome
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null)
    {
        console.log("Nome invalido");
        erros.push({text: "nome inválido"})        
    }
    
    if(req.body.name.length < 3)
    {
        console.log("Nome pequeno");
        erros.push({text: "Nome muito pequeno"})
    }
    if(req.body.name.length > 15)
    {
        console.log("Nome grande");
        erros.push({text: "Nome muito grande"})
    }

    //validação do sobrenome
    if(!req.body.lastname || typeof req.body.lastname == undefined || req.body.lastname == null)
    {
        console.log("sobrenome invalido");
        erros.push({text: "sobrenome inválido"})
    }
    if(req.body.lastname.length < 3)
    {
        console.log("sobrenome pequeno");
        erros.push({text: "Nome muito pequeno"})
    }
    if(req.body.lastname.length > 15)
    {
        console.log("sobrenome grande");
        erros.push({text: "Nome muito grande"})
    }


    //Validação do email
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null)
    {
        console.log("email invalido");
        erros.push({text: "senha inválida"})
    }
    
    //validação da senha
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null)
    {
        console.log("senha invalida");
        erros.push({text: "senha inválida"})
    }
    if(req.body.password.length < 5)
    {
        console.log("senha muito curta");
        erros.push({text: "Senha muito curta"})
    }
    if(req.body.password.length > 20)
    {
        console.log("senha muito longa");
        erros.push({text: "Senha muito longa"})
    }
    
    if(erros.length > 0)
    {
        res.redirect("/register")
        return
    }
    

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
                console.log("erro ao registrar: "+err)
            })
        })
    })
})

module.exports = router