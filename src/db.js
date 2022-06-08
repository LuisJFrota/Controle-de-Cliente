const mongoose = require('mongoose')

//Conectando com o banco
mongoose.Promise = global.Promise
//mongodb+srv://admin:admin@mvpbook.tbwu0zb.mongodb.net/?retryWrites=true&w=majority
//mongodb://localhost:27017/CarrinhoRegistros
mongoose.connect("mongodb://localhost:27017/CarrinhoRegistros").then(()=>{
    console.log("Conectado com o banco do usuário")
}).catch((err) => {
    console.log("Falha ao conectar com o banco")
})

module.exports = {}