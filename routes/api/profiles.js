// this will handle user registration

const express = require('express');
const router = express.Router(); 

//@Route GET api/Profiles
//@desc add profile .. ..
//access Public  
router.get('/',(req, res) => {
    res.send("Profiles route");
})

module.exports = router;