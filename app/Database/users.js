"use strict"
let usersModel

const {getCollection, ObjectId}  = require("./mongodb")

class UsersModel {
	async initialize() {
		this.collection = await getCollection("users")
	}

	async insertGoogleUser(googleUser) {
		return await this.collection.insertOne({...googleUser})
	}

	async findAll() {
		const docs = await this.collection.find().toArray()
		console.log(docs)
		return docs
	}

	async findOne(opts) {
		if (opts._id) opts._id = ObjectId(opts._id)
		const user = await this.collection.findOne(opts)
		if (user) {
			console.log(`findOne found: ${JSON.stringify(user)}`)
			return user
		}
		return
	}
}

const getUsersModel = async () => {
	if (!usersModel) {
		usersModel = new UsersModel()
		await usersModel.initialize()
	}
	return usersModel
}


module.exports = {getUsersModel}