"use strict"
const {MongoClient, ObjectId} = require("mongodb")

const config = require("../../config/db")[process.env.NODE_ENV]

const getCollection = async (name) => {
	let client = new MongoClient(config.connection, { useNewUrlParser: true })
	await client.connect()
	let db = client.db()
	const collection = config.collections[name]
	db.createCollection(collection.name, collection.options)
	return db.collection(collection.name)
}

module.exports = {getCollection, ObjectId}