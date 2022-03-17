const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const db = require('./db')

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({extended: true}))

app.listen(3000, () => {
    console.log("Listen on port 3000")
})

app.get('/', (req, res) => {
    res.render('Register.ejs')
})

app.post('/show', (req,res) => {
    /*
    db.collection('User').save(req.body, (err, result) => {
        if(err) return console.log(err)
        console.log('salvo no banco')
        db.close()
        res.redirect('/')      
    })*/

    console.log(req.body)
    res.redirect('/')
})

