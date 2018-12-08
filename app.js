"use script"
require("dotenv").config()

var express          = require( 'express' )
  , app              = express()
  , server           = require( 'http' ).createServer( app ) 
  , passport         = require( 'passport' )
  , bodyParser       = require( 'body-parser' )
  , cookieParser     = require( 'cookie-parser' )
  , session          = require( 'express-session' )
  , GoogleStrategy   = require( 'passport-google-oauth2' ).Strategy

  const {getUsersModel} = require("./app/Database/users")

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID      = process.env.GOOGLE_CLIENT_ID
  , GOOGLE_CLIENT_SECRET  = process.env.GOOGLE_CLIENT_SECRET

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(async (id, done) => {
	try {
		let usersModel = await getUsersModel()
		let user = await usersModel.findOne({id})
		if (user) done(null, user)
		else done(null, false)
	}
	catch (err) {
		done(err, null)
	}
});


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    //NOTE :
    //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
    //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ 
    //then edit your /etc/hosts local file to point on your private IP. 
    //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
    //if you use it.
    callbackURL: `${process.env.WEB_ORIGIN}/auth/google/callback`,
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
	try {
		/// TODO - ugly. change to findOrCreate and consider new format for user records or separate collections
		const usersModel = await getUsersModel()
		let user = await usersModel.findOne({ id: profile.id })
		if (user) { 
			return done(null, user)}
		let result = await usersModel.insertGoogleUser(profile)
		if (result.insertedCount==1) { 
			return done(null, profile)}
		return done(true, false)
	}
	catch (err) {
		return done(err, false)
	}
  }
));

// configure Express
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.use( express.static(__dirname + '/public'));
app.use( cookieParser()); 
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({
	extended: true
}));
app.use( session({ 
	secret: 'cookie_secret',
	name:   'kaas',
	proxy:  true,
    resave: true,
    saveUninitialized: true
}));
app.use( passport.initialize());
app.use( passport.session());

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', { scope: [
       'https://www.googleapis.com/auth/plus.login',
	   'https://www.googleapis.com/auth/plus.profile.emails.read',
	   'https://www.googleapis.com/auth/userinfo.profile'] 
}))

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get( '/auth/google/callback', 
    	passport.authenticate( 'google', { 
    		successRedirect: '/',
    		failureRedirect: '/login'
}))

app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})

server.listen( 4000 );


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}