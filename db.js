//Config mongo
const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017/"

MongoClient.connect(url, (err, db) => {
    if(err) return console.log(err)
    var dbo = db.db('CarrinhoRegistros')
    var obj = {username: "Mariano", email: "M@gmail.com", password: "123123"}

    dbo.collection("User").insertOne(obj, (err, res) => {
        if (err) return console.log(err)
        console.log("Document Inserted")
        db.close()
    }) 
})

module.exports = {}