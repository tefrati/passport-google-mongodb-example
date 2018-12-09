"use strict"
var express = require("express")
const passport = require("passport")
var router = express.Router()

const googleAuth = passport.authenticate("google", { scope: [
	"https://www.googleapis.com/auth/plus.login",
	"https://www.googleapis.com/auth/plus.profile.emails.read",
	"https://www.googleapis.com/auth/userinfo.profile"] 
})

const googleCallback = passport.authenticate( "google", { 
	successRedirect: "/",
	failureRedirect: "/login"
})

const routes = {
	index: (req, res) => {
		res.render("index", { user: req.user })
	},
	account: (req, res) => {
		res.render("account", { user: req.user })
	},
	login: (req, res) => {
		res.render("login", { user: req.user })
	},
	// GET /auth/google
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in Google authentication will involve
	//   redirecting the user to google.com.  After authorization, Google
	//   will redirect the user back to this application at /auth/google/callback
	googleAuth: (req, res, next) => { 
		googleAuth(req, res, next)
	},
	// GET /auth/google/callback
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	googleCallback: (req, res, next) =>
	{
		googleCallback(req, res, next)
	},
	logout: (req, res) => {
		req.logout()
		res.redirect("/")
	}
}

router
	.get("/", routes.index)
	.get("/account", ensureAuthenticated, routes.account)
	.get("/login", routes.login)
	.get("/auth/google", routes.googleAuth)
	.get("/auth/google/callback", routes.googleCallback)
	.get("/logout", routes.logout)

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next() }
	res.redirect("/login")
}

module.exports = router