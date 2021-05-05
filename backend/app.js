const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect('mongodb+srv://nimesh:' + process.env.MONGO_ATLAS_PW + '@cluster0.lvgwd.mongodb.net/mean-app?retryWrites=true&w=majority')
  .then(() => {
    console.log('connected to db');
  })
  .catch(() => {
    console.log('connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;


