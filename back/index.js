const express = require('express'), 
bodyParser = require('body-parser'), 
connectDB = require('./config/connectDB'),
app = express(), 
cors = require('cors'),
auth = require('./middleware/auth')(), 
session = require("express-session"),
passport = require("passport"),
localStrategy = require("passport-local"),
User = require("./models/User.Model"),
usersRoute = require('./routes/Users.Route'),
productsRoute = require('./routes/Products.Route'),
http = require('http').createServer(app), 
io = require('socket.io')(http , {
    cors: {
      origin: '*',
      }
});

connectDB();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(auth.initialize());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// Passport Config
passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/users", usersRoute);
app.use("/products", productsRoute);

app.set('socketio', io);
io.on('connection', () => {
    
});

http.listen(5000, () => {
  console.log(`Server is running on port ${5000}`);
});