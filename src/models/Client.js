const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClientSchema = Schema({
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
        type: String,
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
    shop: {
        type: Schema.Types.ObjectId,
        ref: "shop",
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('client', ClientSchema)