const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path');
const bodyParser = require("body-parser")
const BASE_URL = process.env.BASE_URL
const DATABASE = process.env.DATABASE
// const Cardata = require("Cardata")


app.use(express.json())
app.use(cors())


app.use(bodyParser.urlencoded({ extended: true }))


app.use(express.static('../client'))

mongoose.connect('mongodb+srv://manpreet94560:LMzSCmifioHI0jKw@onlinetaxi.kmmze.mongodb.net/onlinetaxi')
  .then(() => console.log('connected'))
  .catch((err) => console.log(err))

// cardata

const Carschema = new mongoose.Schema({
  
  Car: String,
  More: String,
  Detail: String,
  From:String,
  To:String,
  Luggage: Number,
  Seats: Number,
  Price: String,
})


const CarModel = mongoose.model('carr', Carschema)
app.get('/findcar', (req, res) => {
  CarModel.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err))
})



const Roundschema = new mongoose.Schema({
  
  Car: String,
  More: String,
  Detail: String,
  From:String,
  To:String,
  Luggage: Number,
  Seats: Number,
  Price: String,
})


const RoundModel = mongoose.model('roundtrip', Roundschema)
app.get('/roundtrip', (req, res) => {
  RoundModel.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err))
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
})

const UserSchema2 = new mongoose.Schema({
  Fromcity2: String,
  Tocity2: String,
  Datee2: String,
  Contact2: Number,
  Person2: Number
})

// multicity

const UserModel2 = mongoose.model('multicity', UserSchema2)


app.post('/multicity', (req, res) => {
  let newUserModel2 = new UserModel2({
      Fromcity2: req.body.Fromcity2,
      Tocity2: req.body.Tocity2,
      Datee2: req.body.Datee2,
      Contact2: req.body.Contact2,
      Person2: req.body.Person2
  })

  newUserModel2.save()
  res.redirect('/')
})

app.get('/findmulticity', (req, res) => {
  UserModel2.find({})
      .then((users) => res.json(users))
      .catch((err) => res.json(err))
})


// Hourly

const Hourlyschema = new mongoose.Schema({
  
  Car: String,
  More: String,
  Detail: String,
  City:String,
  Hours:String,
  Luggage: Number,
  Seats: Number,
  Price: String,
})


const HourlyModel = mongoose.model('hourlytrip', Hourlyschema)
app.get('/hourlytrip', (req, res) => {
  HourlyModel.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err))
})


app.listen(4040)