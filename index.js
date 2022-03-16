const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({extended: true}))

app.listen(3000, () => {
    console.log("Listen on port 3000")
})

/*
//Config mongo
const MongoClient = require('mongodb').MongoClient
const url = "mongodb+srv://cluster0.vnbrq.mongodb.net/Cluster0"

MongoClient.connect(url, (err, client) => {
    if(err) return console.log(err)
    db = client.db('Cluster0')

    app.listen(3000, () => {
        console.log("Listen on port 3000")
    })
})*/


app.get('/', (req, res) => {
    res.render('Register.ejs')
})

app.post('/show', (req,res) => {
    /*
    db.collection('data').save(req.body, (err, result) => {
        if(err) return console.log(err)

        console.log('salvo no banco')
        res.redirect('/')
    })*/

    console.log(req.body)
    res.redirect('/')
})

