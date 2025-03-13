const express = require('express');
require('dotenv').config();
const cors = require('cors');
const usercontroller = require('./controllers/user.controller');
const userRoute = require('./routes/user.route');

const app = express();//create app server

app.use(cors());
app.use(express.json());
app.use('/user', userRoute);


const PORT = process.env.PORT;//port of server


app.get('/', (req, res) => {
    res.json({
        message: "hello world welcome to Thanakorn server"  
});
});

//start server with PORT
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});