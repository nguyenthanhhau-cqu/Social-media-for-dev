const express = require('express');


const app = express();

app.get("/",(req,res) => {
    res.send("API is running");

} 
)

const PORT = process.env.PORT || 5000;   // default port

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
