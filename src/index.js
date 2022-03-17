//Configuração Express
const express = require('express')
const app = express()
const { redirect } = require('express/lib/response')
const router = express.Router()
app.use(express.static(__dirname + '/views'));

//Configuração Body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//Configuração banco
const mongoose = require("mongoose")
const bd = require("./db")
require("./models/User")
const User = mongoose.model("user")

//Configuração path
const path = require('path');


//Configuração ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//Abrindo a porta
app.listen(3000, () => {
    console.log("Listen on port 3000")
})

//Rotas - Mudar para admin.js

router.use((req, res, next) => {
    console.log('muito foda')
    next()
})

app.get('/', (req,res) => {
    res.render('index.ejs')
})

app.get('/register', (req,res) => {
    res.render('Register.ejs')
})

app.post('/register', (req,res) => {
    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    
    new User(userData).save().then(() => {
        console.log("Registrado com sucesso")
    }).catch((err)=>{
        console.log("erro ao registrar")
    })

    res.redirect('/register')
})


