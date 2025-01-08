require('dotenv').config({ debug: true });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sanitize = require("mongo-sanitize");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const app = express();


const PORT = process.env.PORT  || 9000;
const secret = process.env.SECRET;
const value = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema Definitions
const newSchema = new mongoose.Schema({
  name: {type: String, required: true },
  quantity: {type: Number, required: true},
  price: {type: Number, required: true},
  alternativeItem: String,
});

const FormSchema = new mongoose.Schema({
  name: {type: String, required: true },
  email: {type: String, required: true },
  password: {type: String, required: true },
});

const PaymentSchema = new mongoose.Schema({
  delivery: {type: Boolean},
  cardType: String,
  cardholder: String,
  cardNumber: String,
  expirationDate: String,
  cvv: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  paymethod: {type: String, required: true },
  totalcost: {type: Number, required: true}, 
  payPalUsername: String ,
  payPalPassword: String ,
}, { timestamps: true });



// Models
const newModel = mongoose.model('Grocery', newSchema);
const FormModel = mongoose.model('Form', FormSchema);
const PaymentModel = mongoose.model('Payment', PaymentSchema);

// JWT Helper Functions
function encodeToken(payload) {
  return jwt.encode(payload, secret);
}

function decodeToken(token) {
  return jwt.decode(token, secret);
}


app.post('/api/submit', async (req, res) => {
  
  try {
    let data = sanitize({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    });

    const existingUser = await FormModel.findOne({ email: data.email });
    if (existingUser) {
      
      return res.status(400).json({ message: "Username already exists!" });
    } else if (data.email.length == 0 || data.name.length == 0 || data.name.password == 0) {
      return res.status(400).json({ message: "Email, Name, and Password are required for Creation of an Account." });
    } else if (data.password.length < 8) {
      return res.status(400).json({ message: "Password must be greater than 8 characters." });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const newFormData = new FormModel({
      name: data.name,
      password: hashedPassword,
      email: data.email,
      alternativeItem: data.alternativeItem,
    });
    await newFormData.save();
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.post('/api/grocerylist', async (req, res) => {
  try {
    const newFormData = new newModel({
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      alternativeItem: req.body.alternativeItem,
    });

    if (newFormData.name.length == 0){
      return;
    } 
  
    const existingItem = await newModel.findOne({ name: newFormData.name });
    if (existingItem) {
      existingItem.quantity = newFormData.quantity;
      existingItem.price = newFormData.price;
      existingItem.alternativeItem = newFormData.alternativeItem;
      await existingItem.save();
    } else {
      await newFormData.save();
    }
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});


// Delete Route
app.post('/api/delete', async (req, res) => {
  
  
  const { name } = req.body;
  
  const {sanitizedName} = sanitize(name);
 
  try {
    const result = await newModel.deleteOne({ sanitizedName });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No item found with that name' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting the item:', err);
    res.status(500).json({ error: 'Error deleting the item' });
  }
});


app.post('/api/deletetable', async (req, res) => {
  try {
    
    await newModel.deleteMany({});
    res.status(200).json({ message: 'All items deleted' });
  } catch (err) {
    console.error('Error deleting the items:', err);
    res.status(500).json({ error: 'Error deleting all items' });
  }
});

// Authentication Route (Example)
app.use(express.urlencoded({ extended: true }));

app.post('/api/auth', async (req, res) => {
  const { email, password } = req.body;

  try {
    let authorization = sanitize({
      password: req.body.password ,
      email: req.body.email
    });
    console.log("hello");
    const user = await FormModel.findOne({ email: authorization.email });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(authorization.password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: "Invalid username or password" });
    // }
    // const token = encodeToken({ email: user.email });
    
    res.status(200).json({ message: "Authentication successful"});
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/groceries", async (req, res) => {
  
  try {
    const groceries = await newModel.find({});
    console.log(groceries);
    res.status(200).json(groceries);
  } catch (error) {
      res.status(500).json({error: 'Failed to fetch groceries'});
  }
  
});
app.post("/api/deleteOrder", async (req, res) => {
  
  try {
    await newModel.deleteMany({});
    const lastDocument = await PaymentModel.findOneAndDelete().sort({ createdAt: -1 });
    const groceries = await newModel.find({});
    console.log(groceries);
    res.status(200).json(groceries);
  } catch (error) {
      res.status(500).json({error: 'Failed to fetch groceries'});
  }
  
});
app.post("/api/payment", async (req, res) => {
  
 
  const {payment, address} = req.body;
  

  try {

    if (payment.isDeliverySelected){
      const hashedCardNumber = await bcrypt.hash(payment.cardNumber, 10);
      const hashedCardHolderName = await bcrypt.hash(payment.cardholderName, 10);
      let paymentData = {
        cardholder: hashedCardHolderName,
        cardNumber: hashedCardNumber,
        expirationDate: payment.expirationDate,
        cvv: payment.cvv,
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        isDeliverySelected: payment.isDeliverySelected,
        paymethod: payment.payMethod,
        totalcost: payment.totalcost       
      }
      const santizedPayment = sanitize(paymentData);
      const PaymetDoc = new PaymentModel(santizedPayment);
      await PaymetDoc.save();
    } else {
      
      const hashedCardNumber = await bcrypt.hash(payment.cardNumber, 10);
      const hashedCardHolderName = await bcrypt.hash(payment.cardholderName, 10);
      let paymentData = {
        cardholder: hashedCardNumber,
        cardNumber: hashedCardHolderName,
        expirationDate: payment.expirationDate,
        cvv: payment.cvv,
        paymethod: payment.payMethod,
        totalcost: payment.totalcost
      }
      const santizedPayment = sanitize(paymentData);
      const PaymetDoc = new PaymentModel(santizedPayment);
      await PaymetDoc.save();
    }

    
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/paypal", async (req, res) => {
 
  const {payment, address} = req.body;
  
  // console.log(payment);
  
  if (!payment["username"] ||!payment["password"]  || !payment["totalcost"]){
    
    return; 
  }
  
  try {
    

    if (payment.isDeliverySelected){
      const hashedPassword = await bcrypt.hash(payment.password, 10);
      
      if (!address["street"] ||!address["city"]  || !address["zip"]){
    
        return; 
      } else if (address.street.length > 0 || address.city.length > 0 || address.zip != 0 ){
        return
      }
      let paymentData = {
        payPalUsername: payment.username,
        payPalPassword: hashedPassword,
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        isDeliverySelected: payment.isDeliverySelected,
        paymethod: payment.payMethod,
        totalcost: payment.totalcost       
      }
      const santizedPayment = sanitize(paymentData);
      const PaymetDoc = new PaymentModel(santizedPayment);
      await PaymetDoc.save();
    } else {
      
      const hashedPassword = await bcrypt.hash(payment.password, 10);
      
      let paymentData = {
        payPalUsername: payment.username,
        payPalPassword: hashedPassword,
        isDeliverySelected: payment.isDeliverySelected,
        paymethod: payment.payMethod,
        totalcost: payment.totalcost       
      }
      const santizedPayment = sanitize(paymentData);
      const PaymetDoc = new PaymentModel(santizedPayment);
      await PaymetDoc.save();
    }

    
  } catch (error) {
    console.error(error);
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


//const lastDocument = await Model.findOneAndDelete().sort({ createdAt: -1 });