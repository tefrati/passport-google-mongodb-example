"use strict"
const {MongoClient, ObjectId} = require("mongodb")

const config = require("../../config/db")[process.env.NODE_ENV]
let client, db, collections = {}

;(async () => {
	client = new MongoClient(config.connection, { useNewUrlParser: true })
	await client.connect()
	db = client.db()
	for (let name in config.collections) {
		db.createCollection(name, config.collections[name].options)
		collections[name] = db.collection(name)
	}
})()

const getCollection = (name) => {
	return collections[name]
}

// listen for the signal interruption (ctrl-c)
process.on("SIGINT", () => {
	client.close()
	process.exit()
})

module.exports = {getCollection}