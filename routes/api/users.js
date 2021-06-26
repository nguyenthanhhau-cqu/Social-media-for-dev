// this will handle user registration

const express = require('express');
const router = express.Router(); 
const {check,validationResult} = require('express-validator')
const gravatars = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require("../../models/User");
const jwt = require('jsonwebtoken');
const config = require('config');


//@Route POST api/users
//@desc Register user.
//access Public  
router.post('/',[
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password","Please enter a password with 6 or more characters").isLength({min:6})
] ,async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const {name,email,password} = req.body;

    try {
        //check if user is exists
        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({errors:[{msg:"User already exists"}]});
        }
        //create gravatar
        const avatar = gravatars.url(email, {
            s:'200',
            r:'pg',
            d:'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });
        // encrypt password
        const salt = await bcrypt.genSalt(10)//create hashing with
        user.password = await bcrypt.hash(password, salt);
        await user.save();


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