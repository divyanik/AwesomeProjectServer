const express = require('express');
const port = 3001;

const app = express();
const bodyParser = require('body-parser');

require('./database');
require('./models/User');

const authRoutes = require('./routes/authRoute');

app.use(bodyParser.json());
app.use(authRoutes);

app.get('/', (req,res) =>{
    res.send('Mobile Application listening..');
});
app.post('/registration', (req,res) =>{
    res.send('registration api');
});
app.post('/login', (req,res) =>{
    res.send('login api');
});
// app.post('/Welcome', (req,res) =>{
//     res.send('Welcome api');
// });
app.listen(port, () => {
    console.log(`server is running on ${port}`);
});