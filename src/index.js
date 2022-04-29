//Configuração Express
const express = require('express')
const app = express()
const { redirect } = require('express/lib/response')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path');
const admin = require('./routes/admin')
const passport = require('passport')
require('./config/auth')(passport)

//Configuração
    //Sessão
    app.use(session({
        secret: "carrinhosalvo",
        resave: true,
        saveUninitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
    //Middleware
    app.use((req,res,next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        next()
    })
    //css
    app.use(express.static(__dirname + '/views'));

    //Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    //ejs
    app.set('view engine', 'ejs')
    app.set('views', path.join(__dirname, 'views'))

    //Porta
    app.listen(3000, () => {
        console.log("Listen on port 3000")
    })

    //Rotas
    app.use('/', admin)

