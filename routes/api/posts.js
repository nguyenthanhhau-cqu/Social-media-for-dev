// this will handle user registration

const express = require('express');
const router = express.Router(); 

//@Route GET api/Posts
//@desc add profile .. ..
//access Public  
router.get('/',(req, res) => {
    res.send("Posts route");
})


module.exports = router;