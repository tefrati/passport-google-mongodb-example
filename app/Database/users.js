"use strict"

const {ObjectId} = require("mongodb")
const {getCollection}  = require("./mongodb")

class User {

	static async inserUserProfile(user) {
		let collection = getCollection("users")
		return await collection.insertOne({...user})
	}
	
	static async findAll() {
		let collection = getCollection("users")
		const docs = await collection.find().toArray()
		return docs
	}

	static async findOne(opts) {
		if (opts._id) opts._id = ObjectId(opts._id)
		let collection = getCollection("users")
		const user = await collection.findOne(opts)
		if (user) {
			console.log(`findOne found user ${user.profile.displayName}`)
			return user
		}
		return
	}
}

module.exports = {User}