const express = require("express");
const cors = require("cors");
const userRoute = require('./routes/user.route');
const festRoute = require('./routes/fest.route');

const app = express();
const PORT = process.env.PORT;

require('dotenv').config();

//? ใช้ middleware
app.use(cors());
app.use(express.json());
app.use('/user', userRoute);
app.use('/fest',festRoute);


app.get('/', (req, res) => {
    res.json({ message: "Hello, welcome to Thanakorn server!" })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})