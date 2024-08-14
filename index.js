const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path');
const bodyParser = require("body-parser")
// const Cardata = require("Cardata")


app.use(express.json())
app.use(cors())


app.use(bodyParser.urlencoded({ extended: true }))


app.use(express.static('../client'))

mongoose.connect("mongodb://127.0.0.1:27017/Onlinetaxi")
    .then(() => console.log('connected'))
    .catch((err) => console.log(err))


const UserSchema = new mongoose.Schema({
    Fromcity: String,
    Tocity: String,
    Datee: String,
    Contact: Number,
    Person: Number
})


const UserModel = mongoose.model('oneway', UserSchema)


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
})

app.get('/find', (req, res) => {
    UserModel.find({})
        .then((users) => res.json(users))
        .catch((err) => res.json(err))
})





app.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/login.html'));
});
app.get('/@*X!', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/admin.html'));
});

app.post('/oneway', (req, res) => {
    let newUserModel = new UserModel({
        Fromcity: req.body.Fromcity,
        Tocity: req.body.Tocity,
        Datee: req.body.Datee,
        Contact: req.body.Contact,
        Person: req.body.Person
    })

    newUserModel.save()
    res.redirect('/')
})


// Next Form Data 

const UserSchema1 = new mongoose.Schema({
    Fromcity1: String,
    Tocity1: String,
    Datee1: String,
    Contact1: Number,
    Dateee1: String,
    Person1: Number
})


const UserModel1 = mongoose.model('roundtrip', UserSchema1)


app.post('/roundtrip', (req, res) => {
    let newUserModel1 = new UserModel1({
        Fromcity1: req.body.Fromcity1,
        Tocity1: req.body.Tocity1,
        Datee1: req.body.Datee1,
        Contact1: req.body.Contact1,
        Dateee1: req.body.Dateee1,
        Person1: req.body.Person1
    })

    newUserModel1.save()
    res.redirect('/')
})
app.get('/findroundtrip', (req, res) => {
    UserModel1.find({})
        .then((users) => res.json(users))
        .catch((err) => res.json(err))
})




// Third Form Data 

const UserSchema2 = new mongoose.Schema({
    Fromcity2: String,
    Tocity2: String,
    Datee2: String,
    Contact2: Number,
    Person2: Number
})


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

// Fourth Form Data 

const UserSchema3 = new mongoose.Schema({
    Selectcity: String,
    Selectpackage: String,
    Datee3: String,
    Contact3: Number
    
})


const UserModel3 = mongoose.model('hourlybasis', UserSchema3)


app.post('/hourlybasis', (req, res) => {
    let newUserModel3 = new UserModel3({
        Selectcity : req.body.Selectcity,
        Selectpackage: req.body.Selectpackage,
        Datee3: req.body.Datee3,
        Contact3: req.body.Contact3,

    })

    newUserModel3.save()
    res.redirect('/')
})

app.get('/findhourly', (req, res) => {
    UserModel3.find({})
        .then((users) => res.json(users))
        .catch((err) => res.json(err))
})

// Fourth Form Data 

const UserSchema4 = new mongoose.Schema({
    Selectcity1: String,
    Airport: String,
    Datee4: String,
    Contact4: Number
    
})


const UserModel4 = mongoose.model('airport', UserSchema4)


app.post('/airport', (req, res) => {
    let newUserModel4 = new UserModel4({
        Selectcity1 : req.body.Selectcity1,
        Airport: req.body.Airport,
        Datee4: req.body.Datee4,
        Contact4: req.body.Contact4,

    })

    newUserModel4.save()
    res.redirect('/')
})
app.get('/findairport', (req, res) => {
    UserModel4.find({})
        .then((users) => res.json(users))
        .catch((err) => res.json(err))
})



app.listen(4060)
