import { ObjectId } from "mongodb"
import { Car } from "../../../DB/models/car.model.js"

export const addCar = async (req,res) => {
    const {name, model, status} = req.body 

    try {
        const newCar = {
            name,
            model,
            status
        }

        const carData = await Car.insertOne(newCar)

        return res.status(200).json({message: "car added successfully", carData: carData})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error})
    }
}

export const getCar = async (req, res) =>{
    const {id} = req.params 

    try {
        if(!ObjectId.isValid(id)){
            return res.status(400).json({massage: "invaled Car id"})
        }

        const car = await Car.findOne({_id: new ObjectId(id)})
        if(!car){
            return res.status(404).json({ massage: 'car not found' });
        }
        return res.status(200).json({car: car})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error}) 
    }
}

export const getAllCars = async (req, res) => {
    try {
        const carsData = await Car.find().toArray()

        return res.status(200).json({message: "All cars Data", data: carsData})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error}) 
    }
}

export const updatCar = async (req,res) => {
    const {id} = req.params 
    const {name, model} = req.body

    try {
        // check id

        if(!ObjectId.isValid(id)){
            return res.status(400).json({massage: "invaled car id"})
        }

        const updataCarData = {}
        if(name) updataCarData.name = name
        if(model) updataCarData.model = model

        const result = await Car.updateOne(
            {_id: new ObjectId(id)},
            {$set: updataCarData}
        )

        if(result.matchedCount === 0) {
            return res.status(404).json({ massage: 'car not found' });
        }
        return res.status(200).json({massage: "car updataed successfully", result})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error})
    }
}

export const deleteCar = async (req, res) => {
    const { id } = req.params
    try {
        if(!ObjectId.isValid(id)){
            return res.status(400).json({massage: "invaled Car id"})
        }
        const deleteCarData = await Car.deleteOne({_id: new ObjectId(id)})

        if(deleteCarData.deletedCount === 0) {
            return res.status(404).json({ massage: 'car not found' });
        }
        return res.status(200).json({message: "Car deleted successfully", deleteCarData})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error})
    }
}

// Get all cars whose model is ‘Honda’ and ‘Toyota’ (using query params)

export const carsWithModel = async (req, res) =>{
    try {
        const  {model} = req.query 
        let cars
    
        if(model) {
            const models = model.split(','.localeCompare(m=> m.trim()))
            cars = await Car.find({model: {$in: models}}).toArray()
        }else {
            cars = await Car.find().toArray()
        }
        return res.status(200).json({cars})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error})
    }

}

export const getAailableCars = async (req, res) => {
    try {
        const {model} = req.query 
        const cars = await Car.find({model: model, status: "available"}).toArray()
        return res.status(200).json({cars})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error})
    }
}

// Get Cars that are Either rented or of a Specific Model.

export const rentedOrModelCar = async (req, res) => {
    try {
        const {model} = req.query 
        let query = {}

        if(model) {
            query = { $or: [{ status: "rented" }, { model: model}] }
        }else {
            query = {status: "rented"}
        }

        const cars = await Car.find(query).toArray()
        res.status(200).json({cars})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error})
    }
}

// Get Available Cars of Specific Models or Rented Cars of a Specific Model

export const conditionCars = async (req, res) => {
    try {
        const { model, status } = req.query;
        let query = {};

        if (status === 'rented') {
        if (model) {
            query = { $and: [{ status: "rented" }, { model: model }] };
        } else {
            query = { status: "rented" };
        }
        } else if (status === 'available') {
        if (model) {
            query = { $and: [{ status: "available" }, { model: model }] };
        } else {
            query = { status: "available" };
        }
        }

        const cars = await Car.find(query).toArray();
        res.status(200).json({ cars });
    } catch (error) {
        return res.status(500).json({message: "internal server error", error})
    }
}