const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieSession = require('cookie-session');
const passport = require('passport');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: './config/config.env' });
}

// Connect to DB
connectDB();

// Set up passport
const passportSetup = require('./config/passport');

// Route files
const recs = require('./routes/recs');
const auth = require('./routes/auth');
const user = require('./routes/user');

const app = express();

// Body parser
app.use(express.json());

// Cookie setup
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);

// Enable CORS
app.use(cors({ credentials: true, origin: 'http://localhost:8080' }));

app.use(passport.initialize());
app.use(passport.session());

// dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// mount routers
app.use('/api/v1/recs', recs);
app.use('/api/v1/auth', auth);
app.use('/api/v1/user', user);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
