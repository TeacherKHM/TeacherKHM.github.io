// Import the Express library
const express = require('express');

// Create an Express application instance
const app = express();

// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import the 'cleanEnv' function and the 'port' validator from envalid
const { cleanEnv, port } = require('envalid');

// Validate and clean environment variables, ensure PORT is provided and valid
const env = cleanEnv(process.env, {
  PORT: port({default:3000}) // Ensures PORT is a valid port number
});

// Import the CORS middleware to allow cross-origin requests
const cors = require('cors');

// Import the 'path' module to handle file and directory paths
const path = require('path');

// Import custom route handler from 'routes/registry.js'
const userregister = require('./routes/registry.js');
const { get } = require('http');
const session = require('express-session');

app.use(session({
  secret: 'tu_clave_secreta_segura',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true } // Pon en true si usas HTTPS
}));

// Enable CORS for all incoming requests
app.use(cors());

// Middleware to parse URL-encoded bodies (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory (e.g., images, CSS, client-side JS)
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Define the directory where EJS views/templates are located
app.set('views', path.join(__dirname, '/public/views'));

// Mount the custom router on '/users' path
// All routes defined in 'registry.js' will be prefixed with '/users'
app.use('/', userregister);

// Render the 'register' EJS template when the '/register' route is accessed
app.get('/register',(req,res)=> {
    res.render("signup");
});

app.get('/login',(req,res)=>{
    res.render("login");
});

app.get('/home',(req,res)=>{
    res.render("home");
});

// Basic test route for root URL
app.get('/', (req, res) => {
  res.render('home');
});

// Start the server and listen on the port specified in the environment variables
app.listen(env.PORT, () => {
  console.log(`Example app is listening on port ${env.PORT} .`); // Note: will always log 3000 even if another port is used
});
