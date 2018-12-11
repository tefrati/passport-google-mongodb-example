"use script"
require("dotenv").config()
const indexRouter = require("./app/routes/index")

var express          = require( "express" )
	, app              = express()
	, passport         = require( "passport" )
	, bodyParser       = require( "body-parser" )
	, cookieParser     = require( "cookie-parser" )
	, session          = require( "express-session" )
	, morgan 		   = require("morgan")


const port = process.env.PORT || 4000

require("./app/auth")

// configure Express
app.set("views", __dirname + "/app/views")
app.set("view engine", "ejs")
app.use( express.static(__dirname + "/public"))
app.use(morgan("combined"))
app.use( cookieParser()) 
app.use( bodyParser.json())
app.use( bodyParser.urlencoded({
	extended: true
}))
app.use( session({ 
	secret: "cookie_secret",
	name:   "kaas",
	proxy:  true,
	resave: true,
	saveUninitialized: true
}))
app.use( passport.initialize())
app.use( passport.session())

// Mount routes
app.use("/", indexRouter)

// Have the app listen on a default port or 4000
app.listen(port, () => console.log(`app is waiting on port ${port}`)) 