var express  = require('express');
var cors = require('cors')
var app      = express();
app.use(cors({credentials: true, origin: true}))
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var generator = require('generate-password');
var  sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env.SENDGRID_API_KEY);
var path = require('path');
    // fs = require('fs');
 var urls = require('http');
var server = urls.createServer(app);


// var configDB = require('./config/database.js');

mongoose.connect("mongodb://webappdba:Ma13579@35.204.1.127:27017/RxPediaDB");

// mongoose.connect("mongodb://localhost:27017/Medical"); 

require('./config/passport')(passport); 



app.configure(function() {

	app.use(express.cookieParser());
	app.use(express.bodyParser()); 
	app.use(express.static(path.join(__dirname, 'public')));
	app.set('views', __dirname + '/views');
	app.engine('html', require('ejs').renderFile);
	app.use(express.session({ secret: 'knoldus' })); 
	app.use(express.bodyParser({uploadDir:'/images'}));
	app.use(passport.initialize());
	app.use(passport.session()); 
	app.use(flash()); 

});



require('./app/routes.js')(app, passport,server,generator,sgMail ); 

server.listen(port);
console.log('Listening  to  port ' + port);




