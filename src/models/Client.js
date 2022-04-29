const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Client = Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    telefone: {
        type: String,
        require: true
    },
    comprado: {
        type: String,
        require: true
    },
    nasc: {
        type: Date,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('client', Client)