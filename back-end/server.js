var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var passportConfig = require('./config/passport');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var port = process.env.PORT || 3000;

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './assets/')
  },
  filename: function (req, file, cb) {
    var fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + fileExtension);
  }
});
var upload = multer({storage: storage});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_key',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'assets'), {maxAge: 31557600000}));

mongoose.connect(process.env.MONGO_STR || 'mongodb://dev_books@localhost/dev_books');
mongoose.connection.on('error', function () {
  console.error('MongoDB Connection Error');
  process.exit(1);
});
autoIncrement.initialize(mongoose.connection);


// controllers
var UserController = require('./app/controllers/UserController');
var BookController = require('./app/controllers/BookController');

// api routes
app.get('/', function (req, res) {
  res.json({message: 'welcome to books api'});
});
app.get('/user/me', passportConfig.isAuthenticated, UserController.me);
app.post('/login', UserController.login);
app.post('/signup', UserController.signup);
app.get('/logout', passportConfig.isAuthenticated, UserController.logout);

var cpUpload = upload.fields([{name: 'file', maxCount: 1}, {name: 'image', maxCount: 1}]);
app.get('/books', passportConfig.isAuthenticated, BookController.query);
app.post('/books', passportConfig.isAuthenticated, cpUpload, BookController.save);
app.get('/books/:id', passportConfig.isAuthenticated, BookController.queryOne);
app.post('/books/:id', passportConfig.isAuthenticated, cpUpload, BookController.save);
app.delete('/books/:id', passportConfig.isAuthenticated, BookController.delete);

// Start server
app.listen(port);
console.log('Server started on port ' + port);
