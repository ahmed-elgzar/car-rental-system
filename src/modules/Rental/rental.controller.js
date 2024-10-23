import { ObjectId } from "mongodb"
import {Car} from "../../../DB/models/car.model.js"
import {Rental} from "../../../DB/models/rental.model.js"

export const addRent = async (req,res) => {
    const {carId, customer, rentalDate, returnDate} = req.body 
    try {
        const car = await Car.findOne({_id: new ObjectId(carId)})
        if(car.status == "rented"){
            return res.status(400).json({massage: "car is already rented"})
        }

        const newRental = {
            carId: new ObjectId(carId),
            customer: new ObjectId(customer),
            rentalDate: new Date(rentalDate),
            returnDate: new Date(returnDate)
        }
        const result = await Rental.insertOne(newRental)

        await Car.updateOne(
            {_id: new ObjectId(carId)},
            {$set: {status: "rented"}}
        )
        return res.status(200).json({message: "car rented successfully", newRental})
    } catch (error) {
        return res.status(500).json({message: "intrnal server error", error})
    }
}

export const rentalUpdate = async (req, res) => {
    const { id } = req.params 
    const {returnDate} = req.body 
    try {
        if (!ObjectId.isValid(id)){
            return res.status(400).json({ massage: 'Invalid rental ID' });
        }

        const rental = await Rental.findOne({_id: new ObjectId(id)})
        if(!rental) {
            return res.status(404).json({ massage: 'Rental not found' });
        }

        const updateRental = {returnDate: new Date(returnDate)}
        await Rental.updateOne(
            {_id: new ObjectId(id)},
            {$set: updateRental}
        )

        return res.status(200).json({message: "Rental Updated", updateRental})
    } catch (error) {
        return res.status(500).json({message: "intrnal server error", error})
    }
}

export const deleteRental = async (req, res) => {
    const {id} = req.params
    try {
        if(!ObjectId.isValid(id)){
            return res.status(400).json({ massage: 'Invalid rental ID' });
        }
        const rental = await Rental.findOne({_id: new ObjectId(id)})
        if(!rental) {
            return res.status(404).json({ massage: 'Rental not found' });
        }
        await Rental.deleteOne({ _id: new ObjectId(id) });
        return res.status(200).json({message: "Rental deleted successfully"})
    } catch (error) {
        return res.status(500).json({message: "intrnal server error", error})
    }
}

export const allrents = async (req, res) => {
    try {
        const rents = await Rental.find().toArray()

        return res.status(200).json({message: "all Rents data", data: rents})
    } catch (error) {
        return res.status(500).json({message: "intrnal server error", error})
    }
}

export const specificRental = async (req, res) => {
    const {id} = req.params 

    try {
        if(!ObjectId.isValid(id)){
            return res.status(400).json({ massage: 'Invalid rental ID' });
        }
        const rental = await Rental.findOne({_id: new ObjectId(id)})
        if(!rental) {
            return res.status(404).json({ massage: 'Rental not found' });
        }
        return res.status(200).json({Rent: rental})
    } catch (error) {
        return res.status(500).json({message: "intrnal server error", error})
    }
}