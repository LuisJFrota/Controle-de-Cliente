const mongoose = require('mongoose')

//Conectando com o banco
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/CarrinhoRegistros").then(()=>{
    console.log("Conectado com o banco")
}).catch((err) => {
    console.log("Falha ao conectar com o banco")
})

module.exports = {}