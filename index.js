const { port, nodeEnviroment, allowedOrigins } = require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const apiRoute = require("./routes/index");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const winston = require("winston");
const path = require('path');
const fs = require('fs');
const app = express();

// adding logging library
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    allowedHeaders: "*",
    exposedHeaders: "*",
  })
);

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// parse requests of content-type: application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

if (["development"].includes(nodeEnviroment)) {
  app.use(function (req, res, next) {
    logger.info(req.url, req.method);
    logger.info(req.headers);
    logger.info(req.body);
    next();
  });
}

// Define a middleware function to validate the token
function validateToken(req, res, next) {
  // Define an array of routes that should not require token validation
  const excludedRoutes = ['/login', '/register'];

  if (excludedRoutes.includes(req.path)) {
    // Skip token validation for the excluded routes
    return next();
  }

  const token = req.headers.authorization;

  const decodedToken = jwt.decode(token, { complete: true });
  console.log(decodedToken?.payload, 'decodedToken.payload');

  if (!token) {
    return res.status(401).json({ message: 'No token provided or expired' });
  }

  const jwtKey = process.env.JWT_SECRET;
  jwt.verify(token, jwtKey, (err, decoded) => {
    console.log(err, decoded);
    if (err) {
      return res.status(403).json({ message: err });
    }
    req.decoded = decoded;
    next();
  });
}
// Apply the validateToken middleware to all routes that require authentication
app.use('/api/v1', validateToken);

app.use("/api/v1", apiRoute);


// Ensure uploads folder exists
const uploadFolder = './uploads';
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

app.listen(port, () => {
  console.log("Server is running on PORT:", port);
});
