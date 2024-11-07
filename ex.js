const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");
const wbm = require("wbm");
const multer = require('multer');
const nodemailer = require('nodemailer');

const x = "mongodb+srv://manpreet94560:preet123@onlinetaxicluster.fgas8.mongodb.net/Onlinetaxi?retryWrites=true&w=majority";

mongoose.connect(x)
  .then(() => console.log('connected'))
  .catch((err) => console.log(err))

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '../client')));
app.use('/Image', express.static(path.join(__dirname, 'Image'))); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './Image');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
// Routes
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/index.html'));
// });

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
    id, 
    { Price: req.body.Price }, 
    { new: true }
  )
    .then((car) => {
      if (car) {
        res.json({ success: true, data: car });
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
    id, 
    { Price: req.body.Price },
    { new: true } 
  )
    .then((car) => {
      if (car) {
        res.json({ success: true, data: car });
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
    id,
    { Price: req.body.Price },
    { new: true }
  )
    .then((car) => {
      if (car) {
        res.json({ success: true, data: car });
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
  Route: String,
  Phone: String,
  From: String,
  To: String,
  Date1: String,
  Date: String,
  Time: String,
  Address: String,
  Email: String,
  Price: Number,
  CarNamee: String,
  No: Number,
  Email2: String,


})

const BookingModel = mongoose.model('booking', BookingsSchema)

app.post('/Bookform', async (req, res) => {
  try {
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
      CarNamee: req.body.CarNamee,
      No: req.body.No,
      Email2: req.body.Email2,
    });

    const savedBooking = await newBookModel.save();

    const customerName = savedBooking.Name;
    const route = savedBooking.Route;
    const carName = savedBooking.CarNamee;
    const from = savedBooking.From;
    const to = savedBooking.To;
    const price = savedBooking.Price;
    const Order = savedBooking.No;
    const PhoneN = savedBooking.Phone;
    const Date = savedBooking.Date;
    const Time = savedBooking.Time;
    const customerEmail = savedBooking.Email2;

    const messageHtml = `
     <img src="https://onlinetaxi.co.in/Images/sidhu_travels-removebg-preview.png" alt="Online Taxi Logo" height="100"/>
      <p>Your booking is successfully confirmed!</p>
      <p>We are excited to serve you!</p>
      <p><strong>Your Booking Order ID is STO${Order}.</strong></p>
      <p>Name: ${customerName}<br/>
      Number: ${PhoneN}<br/>
      ${route} Booking with our comfortable.<br/>
       Car Type: ${carName}.<br/>
      From city: ${from} <br/>
      To city: ${to}<br/>
      Booking Date: ${Date} <br/>
       Booking Time: ${Time}<br/>
      All set for just ₹${price}.<br/>
      Enjoy a smooth and safe ride ahead!</p>
      <p>Note: Toll/Tax Included. Parking not included.</p>
      <p>Thank you for choosing us. We value your trust!</p>
      <p>Regards,<br/>Online Taxi<br/> +91 9988-2222-83</p>
     
    `;

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'onlinetaxi09@gmail.com', 
        pass: 'lxyw oinz nhts yeqf'
      }
    });

    var mailOptions = {
      from: 'onlinetaxi09@gmail.com', 
      to: [customerEmail, 'onlinetaxi09@gmail.com'],
      subject: 'Booking Confirmation',
      html: messageHtml // Use HTML content with an image URL
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Error in sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  } catch (error) {
    console.error('Error during message sending or saving booking:', error);
    res.status(500).json({ error: 'There was an error processing your request.' });
  }
});


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

  if (req.file) {
    updateData.Image = req.file.filename; 
  }
 
  TourModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true } 
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



app.post('/createroute', upload.single('Image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const newRoute1 = new TourModel({
    Route: req.body.Route,
    Fare: req.body.Fare,
    DiscountPrice: req.body.DiscountPrice,
    MainPrice: req.body.MainPrice,
    Image: req.file.filename,
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



app.get('/bestroute', (req, res) => {
  BestTourModel.find({})
    .then((routes) => res.json(routes))
    .catch((err) => res.json(err));
});

app.post('/createbestroute', upload.fields([{ name: 'Imageu', maxCount: 1 }, { name: 'Image1', maxCount: 1 }]), (req, res) => {
  if (!req.files || !req.files.Imageu || !req.files.Image1) {
    return res.status(400).json({ success: false, message: 'Images are required' });
  }

  const newRoute = new BestTourModel({
    TourCity: req.body.TourCity,
    TourDescription: req.body.TourDescription,
    Review: req.body.Review,
    Price: parseFloat(req.body.Price.replace(/[^0-9]/g, '')),
    Imageu: req.files.Imageu[0].filename,
    Image1: req.files.Image1[0].filename,
    Description: req.body.Description,
  });

  newRoute.save()
    .then((route) => res.status(201).json({ success: true, data: route }))
    .catch((err) => res.status(500).json({ success: false, error: err.message }));
});

app.put("/bestroute/:id", upload.fields([{ name: 'Imageu', maxCount: 1 }, { name: 'Image1', maxCount: 1 }]), (req, res) => {
  const id = req.params.id;

  console.log('Route ID:', id);
  console.log('New Discount Price:', req.body.DiscountPrice);

  const updateData = {
    TourCity: req.body.TourCity,
    TourDescription: req.body.TourDescription,
    Review: req.body.Review,
    Price: req.body.Price,
    Description: req.body.Description,
  };

  if (req.files && req.files.Imageu) {
    updateData.Imageu = req.files.Imageu[0].filename;
  }

  if (req.files && req.files.Image1) {
    updateData.Image1 = req.files.Image1[0].filename;
  }

  BestTourModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true } 
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

  BestTourModel.findById(id)  
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