import { MongoClient } from "mongodb";

const mongodbUri = "mongodb://localhost:27017"

const mongoClient = new MongoClient(mongodbUri)

const db_name = "car-rental-system"

export const connectionDB = async () => {
    try {
        await mongoClient.connect()
        //ceate a database on mongo db 
        console.log("connected to database")
    } catch (error) {
        console.log("error", error)
    }
}

export const db =  mongoClient.db(db_name)