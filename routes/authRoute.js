const express = require('express');
const router = express.Router();
const mongoose =  require('mongoose');

// Models in use
const user = mongoose.model('User');
const jwt = require('jsonwebtoken');

require('dotenv').config();

router.post('/registration', (req, res) => {
    console.log('Registration started');
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(422).send({error: 'All the fields are not filled.'});
    }
    console.log('Inputs validated.');
    console.log(req.body);
    user.findOne({email: email})
        .then(
            async (saveUser) => {
                if(saveUser) {
                    return res.status(422).send({error: 'User already exists'});
                }
                const _user = new user({
                    name, email, password
                })
                try {
                    await _user.save();
                    const token = jwt.sign({ _id: user.id}, 'key123456');
                    res.send({token})
                    console.log('Response processed');
                }
                catch(ex){
                    console.log(ex.message);
                    return res.status(422).send({error: ex.message});
                }   
            }
        )

});

module.exports = router;