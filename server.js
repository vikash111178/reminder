var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');    
var config=require('./models/config');       
var routes = require('./routes/index');
var users = require('./routes/users');
var addmoney=require('./routes/balance');
var updateprofile=require('./routes/imageupload');
//var member=require('./routes/member');


//Connection 
mongoose.connect(config.ServerConnectionURL);

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

//Login UserName show
app.get('*', function(req, res, next){
  res.locals.user = req.user || null; 
  next();
});


// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Route
app.use('/', routes);
app.use('/users', users);
app.use('/addmoney',addmoney);
app.use('/updateprofile',updateprofile);
// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;   
 
  next();
});
 

// Set Port
app.set('port', (process.env.PORT || 8080));
app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
