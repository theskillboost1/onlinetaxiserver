const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path');
const bodyParser = require("body-parser")

const x = "mongodb+srv://manpreet94560:preet123@onlinetaxicluster.fgas8.mongodb.net/Onlinetaxi?retryWrites=true&w=majority"
// const DATABASE = process.x

// const Cardata = require("Cardata")


app.use(express.json())
app.use(cors())


app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('../client'))
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/index.html'));
// })
mongoose.connect(`${x}`)
  .then(() => console.log('connected'))
  .catch((err) => console.log(err))

// cardata

const Carschema = new mongoose.Schema({

  Car: String,
  More: String,
  Detail: String,
  From: String,
  To: String,
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

app.post("/create", (req,res)=>{
  CarModel.create(req.body)
  .then((users) =>{ res.json(users)
      console.log(users)})
  .catch((err) => res.json(err))
})

app.get('/admin', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/login.html'));
});

app.put("/udoneway/:id", (req, res) => {
  const id = req.params.id;

  console.log('Car ID:', id);
  console.log('New Price:', req.body.Price);

  CarModel.findByIdAndUpdate(
    id, // Pass the ID directly
    { Price: req.body.Price }, // Use req.body.Price to update the price
    { new: true } // Optionally return the updated document
  )
    .then((car) => {
      if (car) {
        res.json({ success: true, data: car });
        // res.redirect('/admin')
      } else {
        res.status(404).json({ success: false, message: 'Car not found' });
      }
    })
    .catch((err) => res.status(500).json({ success: false, error: err.message }));
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  CarModel.findByIdAndDelete(id)
      .then((deletedCar) => {
          if (deletedCar) {
              res.json({ message: "Car deleted successfully", deletedCar });
          } else {
              res.status(404).json({ message: "Car not found" });
          }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
});




const Roundschema = new mongoose.Schema({

  Car: String,
  More: String,
  Detail: String,
  From: String,
  To: String,
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

app.put("/udround/:id", (req, res) => {
  const id = req.params.id;

  console.log('Car ID:', id);
  console.log('New Price:', req.body.Price);

  RoundModel.findByIdAndUpdate(
    id, // Pass the ID directly
    { Price: req.body.Price }, // Use req.body.Price to update the price
    { new: true } // Optionally return the updated document
  )
    .then((car) => {
      if (car) {
        res.json({ success: true, data: car });
        // res.redirect('/admin')
      } else {
        res.status(404).json({ success: false, message: 'Car not found' });
      }
    })
    .catch((err) => res.status(500).json({ success: false, error: err.message }));
});
app.post("/createround", (req,res)=>{
  RoundModel.create(req.body)
  .then((users) =>{ res.json(users)
      console.log(users)})
  .catch((err) => res.json(err))
})

app.delete("/deleteround/:id", (req, res) => {
  const id = req.params.id;
  RoundModel.findByIdAndDelete(id)
      .then((deletedCar) => {
          if (deletedCar) {
              res.json({ message: "Car deleted successfully", deletedCar });
          } else {
              res.status(404).json({ message: "Car not found" });
          }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
});




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
  City: String,
  Hours: String,
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
app.put("/udhourly/:id", (req, res) => {
  const id = req.params.id;

  console.log('Car ID:', id);
  console.log('New Price:', req.body.Price);

  HourlyModel.findByIdAndUpdate(
    id, // Pass the ID directly
    { Price: req.body.Price }, // Use req.body.Price to update the price
    { new: true } // Optionally return the updated document
  )
    .then((car) => {
      if (car) {
        res.json({ success: true, data: car });
        // res.redirect('/admin')
      } else {
        res.status(404).json({ success: false, message: 'Car not found' });
      }
    })
    .catch((err) => res.status(500).json({ success: false, error: err.message }));
});
app.post("/createhourly", (req,res)=>{
  HourlyModel.create(req.body)
  .then((users) =>{ res.json(users)
      console.log(users)})
  .catch((err) => res.json(err))
})

app.delete("/deletehourly/:id", (req, res) => {
  const id = req.params.id;
  HourlyModel.findByIdAndDelete(id)
      .then((deletedCar) => {
          if (deletedCar) {
              res.json({ message: "Car deleted successfully", deletedCar });
          } else {
              res.status(404).json({ message: "Car not found" });
          }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
});
// Booking Form


const BookingSchema = new mongoose.Schema({
  Name: String,
  Phone: String,
  From: String,
  To: String,
  Date: String,
  Address: String,
  Email: String
})

// multicity

app.get('/book', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/booking.html'));
})

const BookingModel = mongoose.model('Booking', BookingSchema)


app.post('/book/Bookform', (req, res) => {
  let newBookModel = new BookingModel({
    Name: req.body.Name,
    Phone: req.body.Phone,
    From: req.body.From,
    To: req.body.To,
    Date: req.body.Date,
    Address: req.body.Address,
    Email: req.body.Email
  })

  newBookModel.save()
  res.redirect('/')
})



app.get('/findBookdata', (req, res) => {
  BookingModel.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err))
})

app.listen(4040)