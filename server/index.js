import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config({
  path: "../.env"
});
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://priyanshu:priyanshu1234@cluster0.svwgo43.mongodb.net/thala_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

// Define a schema for the stored data
const thalaSchema = new mongoose.Schema({
    input: { type: String, required: true },
    result: String,
});

const ThalaModel = mongoose.model('ThalaModel', thalaSchema);

// Add the following code inside the /check route handler

// Add the following code inside the /check route handler

app.post('/check', async (req, res) => {
    const input = req.body.input;
  
    // Convert input to uppercase
    const inputUpperCase = input.toUpperCase();
  
    // Check if the input is a number or can be converted to a number
    const isNumber = !isNaN(parseFloat(inputUpperCase)) && isFinite(inputUpperCase);
  
    // Check if the total number of characters is 7
    const has7Characters = inputUpperCase.toString().length === 7;
  
    // Calculate the sum of digits
    const sum = isNumber ? inputUpperCase.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0) : 0;
  
    // Determine the final result based on the conditions
    let resultMessage = '';
    let resultStoredMessage = '';

    if (sum === 7) {
      const sequence = inputUpperCase.toString().split('').join('+');
      resultMessage = `${sequence}=${sum} 💛 Thala For A Reason 💛`;
      resultStoredMessage = `${sequence}=${sum}`;
    } else if (has7Characters) {
      const sequence = inputUpperCase.toString().split('').join('+');
      resultMessage = `${sequence}= 7 💛 Thala For A Reason 💛`;
      resultStoredMessage = `${sequence}= 7`;
    }else {
      resultMessage = 'Input is not related to the number 7';
    }
  
    // Check if the input (in uppercase) already exists in the database
    const existingData = await ThalaModel.findOne({ input: inputUpperCase });
  
    // Save to MongoDB only if the conditions are met and the data doesn't already exist
    if ((sum === 7 || has7Characters) && !existingData) {
      const thalaData = new ThalaModel({
        input: inputUpperCase,
        result: resultStoredMessage,
      });
      await thalaData.save();
    }
  
    // Send the response
    res.json({ message: resultMessage });
  });
  
app.get('/getThalaData', async (req, res) => {
  try {
    // Fetch all saved data from MongoDB
    const thalaData = await ThalaModel.find({});
    res.json({ thalaData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
