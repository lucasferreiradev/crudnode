const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const ObjectId = require('mongodb').ObjectID

const MongoClient = require('mongodb').MongoClient;

//Here is the url created on mongoDB (replaced with user and password)
const uri = "mongodb+srv://cruduser:crudpass@cluster0.8iq1c.mongodb.net/crudnode?retryWrites=true&w=majority";

//Method to connect Database
MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('crudnode') // This is my DB name created on MongoDB

    app.listen(3000, () => {
        console.log('Server running on port 3000')
    })
})

app.use(bodyParser.urlencoded({ extended: true }))

//Setting the archive in order to send it to server and render on browser
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})
//To obtain the content from database we use find data with the collection method.
app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})
//This method will scan/render/show the data results
app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })

    })
})
//This method is provided from express and carry the same topic like get method and redirectng the user after that.
app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Saved in the database')
        res.redirect('/show')
    })
})
//With the route given is possible just indicate which one I will follow and so we have those methods.
app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var surname = req.body.surname
  var course = req.body.course
  var studentid = req.body.studentid    

  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      surname: surname,
      course: course,
      studentid: studentid
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Updated Database')
  })
})
//Here we can apply the same logic structure using the route given, in tihs case just the ID is enough.
app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deleted from the database!')
    res.redirect('/show')
  })
})
