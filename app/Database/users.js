"use strict"
let usersModel

const {ObjectId} = require("mongodb")
const {getCollection}  = require("./mongodb")

class User {

	static async insertGoogleUser(googleUser) {
		let collection = getCollection("users")
		return await this.collection.insertOne({...googleUser})
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
			console.log(`findOne found user ${user.name.givenName} ${user.name.familyName}`)
			return user
		}
		return
	}
}

module.exports = {User}