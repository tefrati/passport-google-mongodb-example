"use strict"

const {ObjectId} = require("mongodb")
const {getCollection}  = require("./mongodb")

class Location {

	static async insertLocation(automaticUserId, location) {
		let collection = getCollection("carLocations")
		location.automaticUserId = automaticUserId
		return await collection.insertOne({...location})
	}

	static async findOne(opts) {
		if (opts._id) opts._id = ObjectId(opts._id)
		let collection = getCollection("carLocations")
		const location = await collection.findOne(opts)
		if (location) {
			console.log(`findOne found location`)
			return location
		}
		return
	}
}

module.exports = {Location}