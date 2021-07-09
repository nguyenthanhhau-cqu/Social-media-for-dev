const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

//connect
connectDB();

//init middleware
app.use(express.json({ extended: false }));

// Make a connect to router
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profiles", require("./routes/api/profiles"));
app.use("/api/posts", require("./routes/api/posts"));

//serve static assets in production

if (process.env.NODE_ENV === "production") {
  //serve static folder in production
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000; // default port

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
