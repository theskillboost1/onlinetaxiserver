const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path');
const bodyParser = require("body-parser")

const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, './Images')
  },
  filename: (req, file, cb)=>{
    console.log(file);
    cb(null, Date.now()+ path.extname(file.originalname));
  }
})
const upload = multer({storage:storage})
// const twilio = require('twilio');

const x = "mongodb+srv://manpreet94560:preet123@onlinetaxicluster.fgas8.mongodb.net/Onlinetaxi?retryWrites=true&w=majority"
// const DATABASE = process.x

// const Cardata = require("Cardata")


app.use(express.json())
app.use(cors())


app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, '../client')));

// Serve the Images folder (this is the correct way)
app.use('/Images', express.static(path.join(__dirname, 'Images')));

// Example route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});
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

app.post("/create", (req, res) => {
  CarModel.create(req.body)
    .then((users) => {
      res.json(users)
      console.log(users)
    })
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
app.post("/createround", (req, res) => {
  RoundModel.create(req.body)
    .then((users) => {
      res.json(users)
      console.log(users)
    })
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
app.post("/createhourly", (req, res) => {
  HourlyModel.create(req.body)
    .then((users) => {
      res.json(users)
      console.log(users)
    })
    .catch((err) => res.json(err))
    
    res.redirect('/admin.html');
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


const BookingsSchema = new mongoose.Schema({
  Name: String,
  Route:String,
  Phone: String,
  From: String,
  To: String,
  Date1: String,
  Date: String,  
  Time: String,
  Address: String,
  Email: String,
  Price:Number,
  CarNamee:String,
  No:Number,
  Email2:String,

  
})

// multicity

app.get('/book', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/booking.html'));
})

const BookingModel = mongoose.model('booking', BookingsSchema)


app.post('/book/Bookform', (req, res) => {
  let newBookModel = new BookingModel({
    Name: req.body.Name,
    Phone: req.body.Phone,
    From: req.body.From,
    To: req.body.To,
    Date: req.body.Date,
    Date1: req.body.Date1,
    Time: req.body.Time,
    Address: req.body.Address,
    Email: req.body.Email,
    Route: req.body.Route,
    Price: req.body.Price,
    CarNamee : req.body.CarNamee,
    No : req.body.No,
    Email2 : req.body.Email2,


  })

  newBookModel.save()
  // res.redirect('../index.html')
})



app.get('/findBookdata', (req, res) => {
  BookingModel.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err))
})

const Tourschema = new mongoose.Schema({

  Route: String,
  Fare: String,
  DiscountPrice: Number,
  MainPrice: Number,
  Image: String,
})


const TourModel = mongoose.model('Toproute', Tourschema)
app.get('/toproute', (req, res) => {
  TourModel.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err))
})

app.put("/toproute/:id", upload.single('Image'), (req, res) => {
  const id = req.params.id;

  console.log('Route ID:', id);
  console.log('New Discount Price:', req.body.DiscountPrice);

  // Prepare the update object
  const updateData = {
    DiscountPrice: req.body.DiscountPrice,
    MainPrice: req.body.MainPrice,
    Route: req.body.Route,
  };

  // Check if a new image is uploaded
  if (req.file) {
    updateData.Image = req.file.filename; // Update the image only if a new one is uploaded
  }

  TourModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true } // Return the updated document
  )
    .then((route) => {
      if (route) {
        res.json({ success: true, data: route });
      } else {
        res.status(404).json({ success: false, message: 'Route not found' });
      }
    })
    .catch((err) => res.status(500).json({ success: false, error: err.message }));
});


// app.post("/createroute",  (req, res) => {
//   TourModel.create(req.body)
//     .then((users) => {
//       res.json(users)
//       console.log(users)
//     })
//     .catch((err) => res.json(err))
// })

app.post('/createroute', upload.single('Image'), (req, res) => {
  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const newRoute1 = new TourModel({
    Route: req.body.Route,
    Fare: req.body.Fare,
    DiscountPrice: req.body.DiscountPrice,
    MainPrice: req.body.MainPrice,
    Image: req.file.filename, // Save the filename of the uploaded file
  });

  newRoute1
    .save()
    .then((route1) => {
      res.json(route1);
      console.log(route1);
    })
    .catch((err) => res.status(500).json(err));
});

app.delete("/deleteroute/:id", (req, res) => {
  const id = req.params.id;
  TourModel.findByIdAndDelete(id)
    .then((deletedCar) => {
      if (deletedCar) {
        res.json({ message: "Route deleted successfully", deletedCar });
      } else {
        res.status(404).json({ message: "Route not found" });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});


const BestTourschema = new mongoose.Schema({
  TourCity: String,
  TourDescription: String,
  Review: String,
  Price: String,
  Imageu: String,
  Image1: String,
  Description: String,
});

const BestTourModel = mongoose.model('Bestroute', BestTourschema);



// GET request to retrieve all BestTour documents
app.get('/bestroute', (req, res) => {
  BestTourModel.find({})
      .then((routes) => res.json(routes))
      .catch((err) => res.json(err));
});

// POST request to create a new BestTour document
app.post('/createbestroute', upload.fields([{ name: 'Imageu', maxCount: 1 }, { name: 'Image1', maxCount: 1 }]), (req, res) => {
  // Check if files are uploaded
  if (!req.files || !req.files.Imageu || !req.files.Image1) {
      return res.status(400).json({ success: false, message: 'Images are required' });
  }

  const price = req.body.Price.replace(/[^0-9]/g, ''); // Sanitize the price
  const newRoute = new BestTourModel({
      TourCity: req.body.TourCity,
      TourDescription: req.body.TourDescription,
      Review: req.body.Review,
      Price: parseFloat(price),
      Imageu: req.files.Imageu[0].filename, // Save the filename of the uploaded Imageu
      Image1: req.files.Image1[0].filename, // Save the filename of the uploaded Image1
      Description: req.body.Description,
  });

  newRoute.save()
      .then((route) => res.status(201).json({ success: true, data: route }))
      .catch((err) => res.status(500).json({ success: false, error: err.message }));
});


app.delete("/deletebestroute/:id", (req, res) => {
  const id = req.params.id;
  BestTourModel.findByIdAndDelete(id)
    .then((deletedCar) => {
      if (deletedCar) {
        res.json({ message: "Route deleted successfully", deletedCar });
      } else {
        res.status(404).json({ message: "Route not found" });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});


app.get('/tourdetails/:id', (req, res) => {
  const id = req.params.id;

  BestTourModel.findById(id)  // Correct Mongoose query to fetch a document by ID
      .then((tourDetails) => {
          if (tourDetails) {
              res.json(tourDetails);
          } else {
              res.status(404).json({ message: 'Tour not found' });
          }
      })
      .catch((err) => {
          res.status(500).json({ error: err.message });
      });
});


app.listen(4040)