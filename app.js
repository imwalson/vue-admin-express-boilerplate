const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const serveFavicon = require('serve-favicon');
const path = require("path");
const expressPinoLogger = require('express-pino-logger');

const feedRoutes = require("./routes/feed");
const templateRoutes = require("./routes/template");
const api = require('./utils/fetch');
const { serverAccessLogger } = require('./utils/logger');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressPinoLogger({ logger: serverAccessLogger }), function(req, res, next) {
  req.log.info('request received');
  next();
});

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

// api proxy
async function apiProxyHandler(req, res) {
  try {
    const replaceUrl = req.originalUrl.replace('/api','');
    // console.log(replaceUrl);
    const data = await api.post(replaceUrl, req.body, {
      headers: req.headers,
      timeout: 0,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    res.json(data);
  } catch (err) {
    res.json({ status: -1, message: err.message });
  }
}
app.get('/api/*', apiProxyHandler);
app.post('/api/*', apiProxyHandler);

app.listen(3000);
