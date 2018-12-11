"use strict"
const rp = require("request-promise")
var {Location} = require("../Database/locations")

const getCurrentParkingLocation = async (accessToken) => {
	let headers = {
		"Authorization": `Bearer ${accessToken}`
	}

	let url = "https://api.automatic.com/trip/?limit=1"
	let response = await rp({url: url, headers: headers, json: true}) 
	if (response && response.results)
	{
		let trip = response.results[0]
		return {
			addressDisplayName: trip.end_address.display_name,
			endLocation: trip.end_location,
			endedAt: trip.ended_at
		}
	}
	return
}

const tripFinishedEvent = tripObj => {
	let trip = tripObj.trip
	let parkingData = {
		addressDisplayName: trip.end_location.display_name,
		endLocation: {lat: trip.end_location.lat, lon: trip.end_location.lon},
		endedAt: new Date(trip.end_time).toISOString()
	}
	Location.insertLocation(tripObj.user.v2_id, parkingData)
}

module.exports = {getCurrentParkingLocation, tripFinishedEvent}
