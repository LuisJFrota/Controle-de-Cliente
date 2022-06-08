const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('../models/User')
const Usuario = mongoose.model("user")

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, password, done) =>{
        Usuario.findOne({email: email}).then((usuario) => {
            if(!usuario) {
                console.log("Usuário inexistente")
                return done(null, false, {message: "Essa conta não existe"})
            }
            
            bcrypt.compare(password, usuario.password, (erro, batem) => {

                if(batem){
                    return done(null, usuario)
                }else{
                    console.log("senha incorreta")
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    })  
}