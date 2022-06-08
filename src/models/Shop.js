const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Shop = Schema({
    name: {
        type: String,
        require: true
    },
    cnpj: {
        type: String,
        require: true
    },
    tipoProduto: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    cidade: {
        type: String,
        require: true
    },
    estado: {
        type: String,
        require: true
    },
    cpf: {
        type: String,
        require: true
    },
    telefone: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('shop', Shop)