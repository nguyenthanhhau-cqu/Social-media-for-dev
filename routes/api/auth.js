// this will handle user registration

const express = require('express');
const router = express.Router(); 
const auth = require('../../middleware/auth');
const User = require("../../models/User");
const jwt = require('jsonwebtoken');
const config = require('config');
const {check,validationResult} = require('express-validator')
const gravatars = require('gravatar');
const bcrypt = require('bcryptjs');
 

//@Route GET api/Auth
//@desc add profile .. ..
//access Public  
router.get('/', auth , async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
})
router.post('/',[
    check("email", "Please enter a valid email").isEmail(),
    check("password","password is required").exists()
] ,async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const {email,password} = req.body;

    try {
        //check if user is exists
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({errors:[{msg:"Invalid credentials"}]});
        }
        const isMatched = await bcrypt.compare(password,user.password);
        if(!isMatched) {
            return res.status(400).json({errors:[{msg:"Invalid credentials"}]});
        }
        const payload = {
            user:{
                id: user.id
            }
        }
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn:36000000},(error,token) => {
            if(error ) throw error;
            res.json({token});
        });

        //return jsonwebtoken
        
    }catch(error) {

        console.log(error.message);
         res.status(500).send("server error");
    }

    //see if user is exist

})



module.exports = router;