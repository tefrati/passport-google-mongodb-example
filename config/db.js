const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOSTNAME = process.env.DB_HOSTNAME
const DB_NAME = process.env.DB_NAME

const DB_QUERYSTRING = process.env.DB_QUERYSTRING

module.exports = {
	development: {
		client: "mongodb",
		connection: `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOSTNAME}/${DB_NAME}?${DB_QUERYSTRING}`,
		collections: {
			users: {
				name: "users",
				options: {
					validationLevel: "strict",
					validator: {
						$jsonSchema: {
							bsonType: "object",
							//required: ["username", "password"],
							//additionalProperties: false,
							properties: {
								_id: {
									bsonType: "objectId",
								},
								username: {
									bsonType: "string", 
								},
								password: {
									bsonType: "string",
								},
								automaticId: {
									bsonType: "string", 
								}
							}
						}
					}
				}
			},
			tokens: {
				name: "tokens",
				options: {
					validationLevel: "strict",
					validator: {
						$jsonSchema: {
							bsonType: "object",
							required: ["token", "uid"],
							additionalProperties: false,
							properties: {
								_id: {
									bsonType: "objectId",
								},
								token: {
									bsonType: "string", 
								},
								uid: {
									bsonType: "objectId",
								}
							}
						}
					}
				}
			},
			parkings: {
				name: "parkings",
				options: {
					validationLevel: "strict",
					validator: {
						$jsonSchema: {
							bsonType: "object",
							required: ["address", "ttl"],
							additionalProperties: false,
							properties: {
								_id: {
									bsonType: "objectId",
								},
								address: {
									bsonType: "string", 
								},
								ttl: {
									bsonType: "int",
								}
							}
						}
					}
				}
			}
		},
		migrations: {},
		seeds: {}
	},
	test: {
		client: "mongodb",
		connection: `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOSTNAME}/${DB_NAME}?${DB_QUERYSTRING}`,
		migrations: {},
		seeds: {}
	}
}