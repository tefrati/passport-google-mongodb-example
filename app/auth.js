const passport         = require( "passport" )
const GoogleStrategy   = require( "passport-google-oauth2" ).Strategy
const AutomaticStrategy = require("passport-automatic").Strategy
var {User} = require("./Database/users")

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID      = process.env.GOOGLE_CLIENT_ID
	, GOOGLE_CLIENT_SECRET  = process.env.GOOGLE_CLIENT_SECRET

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  Then using persistent storage to store 
//   and retrieve full Google Profile
passport.serializeUser(function(user, done) {
	done(null, user.id)
})

// used to deserialize the user
passport.deserializeUser(async (id, done) => {
	try {
		let user = await User.findOne({"profile.id": id})
		if (user) done(null, user)
		else done(null, false)
	}
	catch (err) {
		done(err, null)
	}
})

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy(
	{
		clientID:     GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		//NOTE :
		//Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
		//The workaround is to use a solution such as ngrok
		//Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
		//if you use it.
		callbackURL: `${process.env.WEB_ORIGIN}/auth/google/callback`,
		passReqToCallback   : true
	},
	async function(request, accessToken, refreshToken, profile, done) {
		try {
			/// TODO - ugly. change to findOrCreate and consider new format for user records or separate collections
			let user = await User.findOne({ "profile.id": profile.id })
			if (user) { return done(null, profile)}
			let result = await User.inserUserProfile({source: "Google", profile})
			if (result.insertedCount==1) { return done(null, profile)}
			return done(true, false)
		}
		catch (err) {
			return done(err, false)
		}
	}
))

passport.use(new AutomaticStrategy(
	{
		clientID: process.env.AUTOMATIC_CLIENT_ID,
		clientSecret: process.env.AUTOMATIC_CLIENT_SECRET,
		scope: ["scope:user:profile", "scope:trip", "scope:location", "scope:vehicle:profile", "scope:vehicle:events", "scope:behavior"]
	},
	async (accessToken, refreshToken, profile, done) => {
		try {
			/// TODO - ugly. change to findOrCreate and consider new format for user records or separate collections
			let user = await User.findOne({"profile.id": profile.id})
			if (user) { return done(null, profile)}
			profile.displayName = `${profile.first_name} ${profile.last_name}`
			profile.source = "Automatic"
			let result = await User.inserUserProfile({source: "Automatic", profile})
			if (result.insertedCount==1) { return done(null, profile)}
			return done(true, false)
		}
		catch (err) {
			return done(err, false)
		}
	}
))