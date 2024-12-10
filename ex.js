const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");
const multer = require('multer');
const axios = require('axios');
const nodemailer = require('nodemailer')

require('dotenv').config();
const app = express();
const username = 'manpreet94560'; 
const repo = 'project';  
const branch = 'main';
const token = process.env.GITHUB_TOKEN; 

// MongoDB connection string
const dbURI = "mongodb+srv://manpreet94560:preet123@onlinetaxicluster.fgas8.mongodb.net/Onlinetaxi?retryWrites=true&w=majority";
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client')));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImageToGitHub = async (file) => {
  try {
    const fileName = file.originalname.replace(/\s+/g, '-'); // Replaces spaces with hyphens
    const base64Image = file.buffer.toString('base64'); // Convert the image buffer to base64 string

    const repoFilePath = `Image/${fileName}`; // Folder on GitHub where the image will be uploaded

    const checkFileApiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${repoFilePath}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const existingFileResponse = await axios.get(checkFileApiUrl, { headers });

      const sha = existingFileResponse.data.sha;

      const data = {
        message: `Update image ${fileName}`,
        content: base64Image,
        branch: branch,
        sha: sha 
      };

      const uploadResponse = await axios.put(checkFileApiUrl, data, { headers });
      return uploadResponse.data;

    } catch (error) {
      if (error.response && error.response.status === 404) {
        const data = {
          message: `Upload image ${fileName}`,
          content: base64Image,
          branch: branch
        };
        const uploadResponse = await axios.put(checkFileApiUrl, data, { headers });
        return uploadResponse.data;
      }

      console.error('Error checking file existence:', error.response ? error.response.data : error.message);
      throw error;
    }
  } catch (error) {
    console.error('Error uploading image:', error.response ? error.response.data : error.message);
    throw error;
  }
};

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
  Price: Number,
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

app.put("/updatePrice", (req, res) => {
  let percentage = req.body.Percentage;
  percentage = parseFloat(percentage);
  console.log(percentage);
  if (isNaN(percentage)) {
    return res.status(400).json({ success: false, message: 'Invalid percentage value' });
  }
  const multiplier = percentage >= 0 ? 1 + (percentage / 100) : 1 - (Math.abs(percentage) / 100);
  console.log("Multiplier:", multiplier);
  CarModel.updateMany(
    {}, 
    [
      {
        $set: {
          Price: {
            $round: [{ $multiply: ["$Price", multiplier] }, 0]  
          }
        }
      }
    ]
  )
    .then((result) => {
      if (result.acknowledged && result.modifiedCount > 0) {
        res.json({ success: true, message: 'Price updated for all cars' });
      } else {
        res.status(404).json({ success: false, message: 'No documents found to update' });
      }
    })
    .catch((err) => {
      console.error('Error updating prices:', err);
      res.status(500).json({ success: false, error: err.message });
    });
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
  Price: Number,
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

app.put("/updatePriceRound", (req, res) => {
  let percentage = req.body.Percentage;
  percentage = parseFloat(percentage);
  console.log(percentage);
  if (isNaN(percentage)) {
    return res.status(400).json({ success: false, message: 'Invalid percentage value' });
  }
  const multiplier = percentage >= 0 ? 1 + (percentage / 100) : 1 - (Math.abs(percentage) / 100);
  console.log("Multiplier:", multiplier);
  RoundModel.updateMany(
    {}, 
    [
      {
        $set: {
          Price: {
            $round: [{ $multiply: ["$Price", multiplier] }, 0]  
          }
        }
      }
    ]
  )
    .then((result) => {
      if (result.acknowledged && result.modifiedCount > 0) {
        res.json({ success: true, message: 'Price updated for all cars' });
      } else {
        res.status(404).json({ success: false, message: 'No documents found to update' });
      }
    })
    .catch((err) => {
      console.error('Error updating prices:', err);
      res.status(500).json({ success: false, error: err.message });
    });
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
  Price: Number,
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


app.put("/updatePriceHourly", (req, res) => {
  let percentage = req.body.Percentage;
  percentage = parseFloat(percentage);
  console.log(percentage);
  if (isNaN(percentage)) {
    return res.status(400).json({ success: false, message: 'Invalid percentage value' });
  }
  const multiplier = percentage >= 0 ? 1 + (percentage / 100) : 1 - (Math.abs(percentage) / 100);
  console.log("Multiplier:", multiplier);
  HourlyModel.updateMany(
    {}, 
    [
      {
        $set: {
          Price: {
            $round: [{ $multiply: ["$Price", multiplier] }, 0]  
          }
        }
      }
    ]
  )
    .then((result) => {
      if (result.acknowledged && result.modifiedCount > 0) {
        res.json({ success: true, message: 'Price updated for all cars' });
      } else {
        res.status(404).json({ success: false, message: 'No documents found to update' });
      }
    })
    .catch((err) => {
      console.error('Error updating prices:', err);
      res.status(500).json({ success: false, error: err.message });
    });
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
      html: messageHtml 
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
  Image: String, // Image stored as a filename
});

const TourModel = mongoose.model('Toproute', Tourschema);

app.post('/upload-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const uploadResponse = await uploadImageToGitHub(req.file);
    res.json({ success: true, message: 'Image uploaded successfully', data: uploadResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading image', error: error.message });
  }
});

// Route to fetch all routes
app.get('/toproute', (req, res) => {
  TourModel.find({})
    .then((routes) => res.json(routes))
    .catch((err) => res.status(500).json({ success: false, error: err.message }));
});

app.post('/createroute', upload.single('Image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded' });
  }

  const newRoute = new TourModel({
    Route: req.body.Route,
    Fare: req.body.Fare,
    DiscountPrice: req.body.DiscountPrice,
    MainPrice: req.body.MainPrice,
    Image: req.file.originalname, // Use the same name as the uploaded file
  });

  newRoute.save()
    .then(route => {
      const file = req.file;
      uploadImageToGitHub(file)
        .then(() => {
          res.json({ success: true, route });
        })
        .catch(error => {
          console.error('Error uploading image to GitHub:', error);
          res.status(500).json({ success: false, message: 'Failed to upload image to GitHub', error });
        });
    })
    .catch(err => res.status(500).json({ success: false, error: err.message }));
});

// Route to update an existing route (PUT method)
app.put('/toproute/:id', upload.single('Image'), (req, res) => {
  const id = req.params.id;
  const updateData = {
    Route: req.body.Route,
    Fare: req.body.Fare,
    DiscountPrice: req.body.DiscountPrice,
    MainPrice: req.body.MainPrice,
  };

  if (req.file) {
    updateData.Image = req.file.originalname;  // Use the same image name
  }

  TourModel.findByIdAndUpdate(id, updateData, { new: true })
    .then(route => {
      if (route) {
        if (req.file) {
          const file = req.file;
          uploadImageToGitHub(file)
            .then(() => {
              res.json({ success: true, route });
            })
            .catch(error => {
              console.error('Error uploading image to GitHub:', error);
              res.status(500).json({ success: false, message: 'Failed to upload image to GitHub', error });
            });
        } else {
          res.json({ success: true, route });
        }
      } else {
        res.status(404).json({ success: false, message: 'Route not found' });
      }
    })
    .catch(err => res.status(500).json({ success: false, error: err.message }));
});

// Route to delete a route (DELETE method)
app.delete("/deleteroute/:id", (req, res) => {
  const id = req.params.id;
  TourModel.findByIdAndDelete(id)
    .then(deletedRoute => {
      if (deletedRoute) {
        res.json({ message: "Route deleted successfully", deletedRoute });
      } else {
        res.status(404).json({ message: "Route not found" });
      }
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

const BestTourschema = new mongoose.Schema({
  TourCity: String,
  TourDescription: String,
  Review: String,
  Price: Number,  
  Imageu: String,
  Image1: String,
  Description: String,
  DaysData: [{  
    heading: String,
    description: String
  }]
});

const BestTourModel = mongoose.model('Bestroute', BestTourschema);




app.get('/bestroute', (req, res) => {
  BestTourModel.find({})
    .then((routes) => res.json(routes))
    .catch((err) => res.json(err));
});

app.post('/createbestroute', upload.fields([{ name: 'Imageu', maxCount: 1 }, { name: 'Image1', maxCount: 1 }]), async (req, res) => {
  console.log('Request files:', req.files);  // Debugging the file upload
  if (!req.files || !req.files.Imageu || !req.files.Image1) {
    return res.status(400).json({ success: false, message: 'Images are required' });
  }

  try {
    const imageUploadPromises = [
      uploadImageToGitHub(req.files.Imageu[0]),  
      uploadImageToGitHub(req.files.Image1[0])   
    ];

    await Promise.all(imageUploadPromises);

    // Parsing DaysData (submitted from frontend) into an array
    let daysData = [];
    if (req.body.DaysData) {
      try {
        daysData = JSON.parse(req.body.DaysData); // Parse the DaysData JSON string into an object
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid DaysData format' });
      }
    }

    const newRoute = new BestTourModel({
      TourCity: req.body.TourCity,
      TourDescription: req.body.TourDescription,
      Review: req.body.Review,
      Price: parseFloat(req.body.Price.replace(/[^0-9]/g, '')),  // Ensure price is cleaned and parsed correctly
      Imageu: req.files.Imageu[0].originalname,  
      Image1: req.files.Image1[0].originalname,  
      Description: req.body.Description,
      DaysData: daysData,  // Include the days data
    });

    const route = await newRoute.save();

    res.status(201).json({ success: true, data: route });
  } catch (error) {
    console.error('Error creating BestTour route:', error.message);
    res.status(500).json({ success: false, message: 'Failed to upload images to GitHub or save route data', error: error.message });
  }
});

app.put("/bestroute/:id", upload.fields([{ name: 'Imageu', maxCount: 1 }, { name: 'Image1', maxCount: 1 }]), async (req, res) => {
  const id = req.params.id;

  // Prepare the data to be updated
  const updateData = {
    TourCity: req.body.TourCity,
    TourDescription: req.body.TourDescription,
    Review: req.body.Review,
    Price: parseFloat(req.body.Price.replace(/[^0-9]/g, '')), 
    Description: req.body.Description,
  };

  if (req.files && req.files.Imageu) {
    updateData.Imageu = req.files.Imageu[0].originalname;  
  }

  if (req.files && req.files.Image1) {
    updateData.Image1 = req.files.Image1[0].originalname;  
  }

  let daysData = [];
  if (req.body.DaysData) {
    try {
      daysData = JSON.parse(req.body.DaysData);
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid DaysData format' });
    }
  }
  updateData.DaysData = daysData; 

  try {
    // Update the BestTour route in the database
    const route = await BestTourModel.findByIdAndUpdate(id, updateData, { new: true });

    if (route) {
      // If images are updated, upload them to GitHub
      const imageUploadPromises = [];

      if (req.files && req.files.Imageu) {
        imageUploadPromises.push(uploadImageToGitHub(req.files.Imageu[0]));  // Upload first image
      }

      if (req.files && req.files.Image1) {
        imageUploadPromises.push(uploadImageToGitHub(req.files.Image1[0]));  // Upload second image
      }

      // Wait for the images to be uploaded
      await Promise.all(imageUploadPromises);

      // Return the updated route data as a response
      res.json({ success: true, data: route });
    } else {
      res.status(404).json({ success: false, message: 'Route not found' });
    }
  } catch (error) {
    console.error('Error updating BestTour route:', error.message);
    res.status(500).json({ success: false, message: 'Failed to upload images to GitHub or update route data', error: error.message });
  }
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