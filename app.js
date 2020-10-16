const express = require("express");
const bodyParser = require("body-parser");
const serveFavicon = require('serve-favicon');
const path = require("path");

const feedRoutes = require("./routes/feed");
const templateRoutes = require("./routes/template");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//serve the content straight from the distribution folder (output after npm run build)
app.use(express.static("dist"));

//serve out the api
app.use("/api/feed", feedRoutes);

// vue-admin-template apis
app.use('/vue-admin-template', templateRoutes);

app.use(serveFavicon(path.join(__dirname, 'static', 'favicon.ico')));

app.listen(3000);
