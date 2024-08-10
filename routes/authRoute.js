const express = require('express');
const router = express.Router();
const mongoose =  require('mongoose');

// Models in use
const user = mongoose.model('User');

const jwt = require('jsonwebtoken');

require('dotenv').config();

// User Registration
router.post('/registration', (req, res) => {
    console.log('Registration request received.');
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(422).send({error: 'All the fields are required.'});
    }
    console.log('Inputs validated.');
    console.log(req.body);
    user.findOne({email: email})
        .then(
            async (userRecordSet) => {
                if(userRecordSet) {
                    return res.status(422).send({error: 'User already exists'});
                }
                const _user = new user({
                    name, email, password
                })
                try {
                    await _user.save();
                    res.json({ 
                        userId: user._id 
                    });
                    console.log('User registered successfully.');
                }
                catch(ex){
                    console.log(ex.message);
                    return res.status(422).send('Error: Try Again!');
                }   
            }
        )
});

// User Login
router.post('/login', (req,res) => {
    const { email, password } = req.body;

    console.log('Login request received.');
    console.log('Request body:', req.body);
    if(!email || !password) {
        return res.status(422).send('Invalid credentials.');
    }
    try {
        user.findOne({email: email})
        .then(
            async (userRecordSet) => {
                console.log('userRecordSet:', userRecordSet)
                if(!userRecordSet) {
                    console.log('User not found in the database.');
                    return res.status(422).send('Invalid credentials.');
                }
                if (userRecordSet && (await userRecordSet.validatePassword(password))) {
                    // Generate a valid token;
                    const token = jwt.sign({ id: user._id }, 'key123456', { expiresIn: '5h' });
                    console.log('Login Successful.',userRecordSet);
                    return res.json({ 
                        token, 
                        userId: userRecordSet._id,
                        userName: userRecordSet.name
                    });                
                }
                console.log('Login Failed. No password match.');
                return res.status(422).send('Invalid Credentials');               
            }
        )
    }
    catch(ex) {
        console.log(ex.message);
        return res.status(422).send('Error: Try Again!');
    }
});

module.exports = router;